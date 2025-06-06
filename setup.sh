#!/bin/bash

echo "Setting up KleverFarms Laravel Backend..."

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Create database (MySQL)
echo "Creating database..."
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS kleverfarms;"

# Run migrations
php artisan migrate

# Seed database with sample data
php artisan db:seed

# Create storage link
php artisan storage:link

# Set permissions
chmod -R 775 storage
chmod -R 775 bootstrap/cache

echo "Setup complete!"
echo "You can now start the server with: php artisan serve"
echo ""
echo "Sample farmer login:"
echo "Email: rajesh@example.com"
echo "Password: password"
echo ""
echo "Admin login:"
echo "Email: admin@kleverfarms.com"
echo "Password: password"
