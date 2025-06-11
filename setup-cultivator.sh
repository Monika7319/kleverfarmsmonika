#!/bin/bash

echo "Setting up Cultivator/Harvest system..."

# Run migrations
php artisan migrate

# Create storage directories
mkdir -p public/harvests/images
mkdir -p public/cultivators/images

# Set permissions
chmod 755 public/harvests/images
chmod 755 public/cultivators/images

# Clear caches
php artisan config:clear
php artisan cache:clear
php artisan route:clear

echo "Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update your .env file with database credentials"
echo "2. Set SANCTUM_STATEFUL_DOMAINS in .env"
echo "3. Create a cultivator account for testing"
echo "4. Test the farmer dashboard at /farmer-dashboard"
