import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

export default function Settings() {
  const [settings, setSettings] = useState({
    primaryColor: '#1E94D4',
    secondaryColor: '#153864',
    backgroundColor: '#FBFBFB',
    logoUrl: 'https://firebasestorage.googleapis.com/v0/b/movie-and-series-b78d0.appspot.com/o/files%2FIMG_20250915_023025.png?alt=media&token=fa4e5540-463f-41c3-85c0-2831bd8258c6',
    adminPassword: 'PharmaX@2025!',
  });
  
  const { toast } = useToast();

  const handleSave = () => {
    // In a real app, save to Firebase
    toast({
      title: "Settings Saved",
      description: "System settings have been updated successfully",
    });
  };

  const colorOptions = [
    { name: 'Primary Blue', value: '#1E94D4' },
    { name: 'Secondary Navy', value: '#153864' },
    { name: 'Background Light', value: '#FBFBFB' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#153864] mb-2">System Settings</h2>
        <p className="text-gray-600">Configure system appearance and security</p>
      </div>

      {/* Brand Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Brand Colors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="primaryColor">Primary Color</Label>
            <div className="flex items-center space-x-3 mt-1">
              <Input
                id="primaryColor"
                type="color"
                value={settings.primaryColor}
                onChange={(e) => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                className="w-16 h-10"
              />
              <span className="text-sm text-gray-600">{settings.primaryColor}</span>
            </div>
          </div>

          <div>
            <Label htmlFor="secondaryColor">Secondary Color</Label>
            <div className="flex items-center space-x-3 mt-1">
              <Input
                id="secondaryColor"
                type="color"
                value={settings.secondaryColor}
                onChange={(e) => setSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                className="w-16 h-10"
              />
              <span className="text-sm text-gray-600">{settings.secondaryColor}</span>
            </div>
          </div>

          <div>
            <Label htmlFor="backgroundColor">Background Color</Label>
            <div className="flex items-center space-x-3 mt-1">
              <Input
                id="backgroundColor"
                type="color"
                value={settings.backgroundColor}
                onChange={(e) => setSettings(prev => ({ ...prev, backgroundColor: e.target.value }))}
                className="w-16 h-10"
              />
              <span className="text-sm text-gray-600">{settings.backgroundColor}</span>
            </div>
          </div>

          <div className="pt-2">
            <Label className="text-sm font-medium">Recommended Brand Colors:</Label>
            <div className="flex space-x-2 mt-2">
              {colorOptions.map((color) => (
                <div
                  key={color.value}
                  className="flex flex-col items-center space-y-1 cursor-pointer"
                  onClick={() => {
                    if (color.name.includes('Primary')) {
                      setSettings(prev => ({ ...prev, primaryColor: color.value }));
                    } else if (color.name.includes('Secondary')) {
                      setSettings(prev => ({ ...prev, secondaryColor: color.value }));
                    } else {
                      setSettings(prev => ({ ...prev, backgroundColor: color.value }));
                    }
                  }}
                >
                  <div
                    className="w-8 h-8 rounded border-2 border-gray-200"
                    style={{ backgroundColor: color.value }}
                  />
                  <span className="text-xs text-gray-600">{color.name}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logo Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Logo Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input
              id="logoUrl"
              value={settings.logoUrl}
              onChange={(e) => setSettings(prev => ({ ...prev, logoUrl: e.target.value }))}
              placeholder="Enter logo URL"
              className="mt-1"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div>
              <Label className="text-sm text-gray-600">Current Logo:</Label>
              <img 
                src={settings.logoUrl} 
                alt="Current Logo" 
                className="mt-1 h-12 w-12 object-contain border rounded"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="adminPassword">Admin Password</Label>
            <Input
              id="adminPassword"
              type="password"
              value={settings.adminPassword}
              onChange={(e) => setSettings(prev => ({ ...prev, adminPassword: e.target.value }))}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Current password: PharmaX@2025!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Card>
        <CardContent className="pt-6">
          <Button 
            onClick={handleSave}
            className="w-full bg-[#1E94D4] hover:bg-[#153864] text-white"
          >
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
