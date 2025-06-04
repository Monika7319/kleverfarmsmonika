<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Klever_comment;

class KleverCommentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'farm_id' => 'required|integer|exists:farms,id',
            'comment' => 'required|string',
        ]);
    
        $existing = Klever_comment::where('farm_id', $request->farm_id)->first();
    
        if ($existing) {
            $existing->comment = $request->comment;
            $existing->save();
            return response()->json(['updated' => true, 'comment' => $existing]);
        } else {
            $comment = Klever_comment::create([
                'farm_id' => $request->farm_id,
                'comment' => $request->comment,
            ]);
            return response()->json(['created' => true, 'comment' => $comment]);
        }
    }
    

    public function show($farmId)
    {
        $comments = Klever_comment::where('farm_id', $farmId)
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'comments' => $comments
        ]);
    }
}
