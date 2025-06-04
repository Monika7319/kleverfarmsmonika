<?php

namespace App\Http\Controllers;

use App\Models\Farm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image;
use App\Models\Klever_comment;

use Illuminate\Support\Facades\Mail;
use App\Mail\AdminNewFarmMail;
use App\Mail\FarmerConfirmationMail;
use App\Mail\FarmApprovalStatusMail;
use Illuminate\Support\Facades\Log;

class FarmController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $farms = Farm::select(
            'id',
            'email', 'phone',
            'farmName', 'ownerName', 'city', 'state',
            'is_verified', 'is_active',
            'images', 'farmSize', 'farmType',
            'farmingMethods', 'specialties', 'address',
            'created_at'
        )->orderBy('created_at', 'desc')->get();
    
        $farms->transform(function ($farm) {
            switch ($farm->is_verified) {
                case 1:
                    $farm->status = 'approved';
                    break;
                case 3:
                    $farm->status = 'rejected';
                    break;
                default:
                    $farm->status = 'pending';
                    break;
            }
            return $farm;
        });
    
        return response()->json(['farms' => $farms], 200);
    }
    
    
    
   // FarmController.php

 // FarmController.php

 // Show one farm
 public function show($id)
 {
     $farm = Farm::find($id);
 
     if (!$farm) {
         return response()->json(['message' => 'Farm not found'], 404);
     }
 
     $farm->images = is_string($farm->images) ? json_decode($farm->images, true) : $farm->images;
     $farm->farmingMethods = is_string($farm->farmingMethods) ? json_decode($farm->farmingMethods, true) : $farm->farmingMethods;
     $farm->specialties = is_string($farm->specialties) ? json_decode($farm->specialties, true) : $farm->specialties;
 
     switch ($farm->is_verified) {
         case 1:
             $farm->status = 'approved';
             break;
         case 3:
             $farm->status = 'rejected';
             break;
         default:
             $farm->status = 'pending';
             break;
     }
 
     return response()->json(['farm' => $farm]);
 }
 
 


 public function update(Request $request, $id)
 {
    \Log::info('FARM UPDATE REQUEST', $request->all());

    $farm = Farm::find($id);
    if (!$farm) {
        return response()->json(['message' => 'Farm not found'], 404);
    }

    \Log::info('Farm found for update: ID ' . $farm->id);

    // ✅ Quick status-only update (PATCH via POST/FormData)
    if ($request->has('is_verified') && !$request->hasFile('image_files') && !$request->has('farmName')) {
        $farm->is_verified = (int)$request->input('is_verified');
        $farm->save();
        $statusText = $farm->is_verified == 1 ? 'approved' : ($farm->is_verified == 3 ? 'rejected' : 'pending');
        Mail::to($farm->email)->send(new FarmApprovalStatusMail($farm, $statusText));
    
        \Log::info('Quick is_verified update done', ['is_verified' => $farm->is_verified]);

        return response()->json([
            'message' => 'Farm status updated successfully',
            'farm' => $farm->fresh(),
        ]);
    }


     // ✅ Full form update (edit + save)
     $validated = $request->validate([
         'farmName'         => 'nullable|string|max:255',
         'email'            => 'nullable|email|max:255',
         'phone'            => 'nullable|string|max:20',
         'address'          => 'nullable|string|max:255',
         'city'             => 'nullable|string|max:100',
         'state'            => 'nullable|string|max:100',
         'zip'              => 'nullable|string|max:20',
         'description'      => 'nullable|string',
         'farmingMethods'   => 'nullable|array',
         'farmingMethods.*' => 'string',
         'specialties'      => 'nullable|array',
         'specialties.*'    => 'string',
         'images'           => 'nullable|array|max:5',
         'images.*'         => 'string',
         'image_files.*'    => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048',
         'is_verified'      => 'required',
         'admin_comment'    => 'nullable|string',
     ]);
 
     // ✅ Assign values
     $farm->fill([
         'farmName'    => $request->farmName ?? $farm->farmName,
         'email'       => $request->email ?? $farm->email,
         'phone'       => $request->phone ?? $farm->phone,
         'address'     => $request->address ?? $farm->address,
         'city'        => $request->city ?? $farm->city,
         'state'       => $request->state ?? $farm->state,
         'zip'         => $request->zip ?? $farm->zip,
         'description' => $request->description ?? $farm->description,
         'is_verified' => (int)$request->is_verified,
         'is_active'   => $request->is_verified == 3 ? 0 : 1,
     ]);
 
     if ($request->filled('farmingMethods')) {
         $farm->farmingMethods = json_encode($request->farmingMethods);
     }
 
     if ($request->filled('specialties')) {
         $farm->specialties = json_encode($request->specialties);
     }
 
     // ✅ Handle images
     $finalImages = is_array($farm->images) ? $farm->images : json_decode($farm->images, true);

     // If new image filenames are sent
     if ($request->has('images')) {
         $finalImages = $request->images;
     }
     
     // If new files are uploaded
     if ($request->hasFile('image_files')) {
         foreach ($request->file('image_files') as $index => $image) {
             $farmSlug = str_replace(' ', '_', strtolower($farm->farmName ?? 'farm'));
             $filename = $farmSlug . '_' . time() . "_$index.webp";
             $image->move(public_path('farms/images'), $filename);
             $finalImages[] = $filename;
         }
     }
     
     // Limit to 5 only if new data was added
     if ($request->has('images') || $request->hasFile('image_files')) {
         $finalImages = array_slice($finalImages, 0, 5);
         $farm->images = json_encode($finalImages);
     }
     






 
     try {
         $farm->save();
     } catch (\Exception $e) {
         \Log::error("Farm save failed: " . $e->getMessage());
         return response()->json(['message' => 'Failed to update farm'], 500);
     }
 
     // ✅ Add admin comment
     if ($request->filled('admin_comment')) {
         Klever_comment::create([
             'farm_id' => $farm->id,
             'comment' => $request->admin_comment,
         ]);
     }
 
     // Decode JSON fields before returning
     $farm->images = json_decode($farm->images);
     $farm->farmingMethods = json_decode($farm->farmingMethods);
     $farm->specialties = json_decode($farm->specialties);
 
     return response()->json([
         'message' => 'Farm updated successfully',
         'farm'    => $farm->fresh(),
     ]);
 }
 


    
    
    
    

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
  

public function store(Request $request)
{
    $validated = $request->validate([
        'farmName' => 'required|string',
        'ownerName' => 'required|string',
        'email' => 'required|email|unique:farms',
        'phone' => 'required|string',
        'password' => 'required|string',
        'address' => 'required|string',
        'city' => 'required|string',
        'state' => 'required|string',
        'zip' => 'required|string',
        'farmSize' => 'required|string',
        'farmType' => 'required|string',
        'description' => 'required|string',
        'farmingMethods' => 'required|array',
        'specialties' => 'required|array',
        'images.*' => 'image|mimes:jpeg,png,jpg,webp',
        'acceptTerms' => 'required|boolean',
        'latitude' => 'nullable|string',
        'longitude' => 'nullable|string',
    ]);

    $validated['password'] = \Hash::make($validated['password']);
    $validated['is_verified'] = false;
    $validated['is_active'] = true;
    $validated['user_id'] = auth()->id() ?? null;

    // Slug generation: farmname-in-city-state

    $imagePaths = [];

    if ($request->hasFile('images')) {
        foreach ($request->file('images') as $index => $image) {
            $farmNameSlug = str_replace(' ', '_', strtolower($validated['farmName']));
            $filename = $farmNameSlug . '_' . time() . "_$index.webp";
            $image->move(public_path('farms/images'), $filename);
            $imagePaths[] = $filename;
        }
    }

    $validated['images'] = json_encode($imagePaths);

    $farm = Farm::create($validated);
    Mail::to('admin@example.com')->send(new AdminNewFarmMail($farm));
    Mail::to($farm->email)->send(new FarmerConfirmationMail($farm));
    
    return response()->json([
        'message' => 'Farm registered successfully',
        'farm' => $farm
    ], 201);
}







    public function edit(Farm $farm)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
  
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Farm $farm)
    {
        try {
            // Remove stored images
            if ($farm->images) {
                $images = is_string($farm->images) ? json_decode($farm->images, true) : $farm->images;
    
                foreach ($images as $img) {
                    $path = public_path('farms/images/' . $img);
                    if (file_exists($path)) {
                        @unlink($path);
                    }
                }
            }
    
            $farm->delete();
    
            return response()->json(['message' => 'Farm and images deleted successfully'], 200);
        } catch (\Exception $e) {
            \Log::error('Farm delete error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to delete farm'], 500);
        }
    }
    // public function showBySlug($slug)
    // {

    //     dd(DB::connection()->getDatabaseName());

    //     \Log::info("Looking for farm with slug: " . $slug); // This should appear in logs
    
    //     $farm = Farm::where('slug', $slug)->first();
    
    //     if (!$farm) {
    //         \Log::warning("No farm found for slug: " . $slug);
    //         return response()->json(['message' => 'Farm not found'], 404);
    //     }
    
    //     $farm->images = json_decode($farm->images ?? '[]', true);
    //     $farm->farmingMethods = json_decode($farm->farmingMethods ?? '[]', true);
    //     $farm->specialties = json_decode($farm->specialties ?? '[]', true);
    
    //     return response()->json(['farm' => $farm]);
    // }
    
   

    
}
