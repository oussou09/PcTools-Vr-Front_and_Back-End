<?php

namespace Database\Seeders;

use App\Models\ProductCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ProductCategory::insert([
            ['name_category' => 'CPUs / Processors', 'path' => 'null'],
            ['name_category' => 'Motherboards', 'path' => 'null'],
            ['name_category' => 'Video Graphic Devices', 'path' => 'null'],
            ['name_category' => 'Computer Cases', 'path' => 'null'],
            ['name_category' => 'Power Supplies', 'path' => 'null'],
            ['name_category' => 'Memory', 'path' => 'null'],
            ['name_category' => 'Solid State Drives', 'path' => 'null'],
            ['name_category' => 'Hard Drives', 'path' => 'null'],
            ['name_category' => 'PC Cooling', 'path' => 'null'],
        ]);
    }
}
