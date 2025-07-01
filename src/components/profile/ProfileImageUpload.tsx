
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ImageCropper } from '@/components/ui/image-cropper';
import { toast } from 'sonner';
import { Camera, Upload } from 'lucide-react';

interface ProfileImageUploadProps {
  currentImageUrl?: string;
  userInitials: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ProfileImageUpload = ({ currentImageUrl, userInitials, size = 'md' }: ProfileImageUploadProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  const uploadImage = useMutation({
    mutationFn: async (file: File) => {
      if (!user) throw new Error('No user found');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      return publicUrl;
    },
    onSuccess: () => {
      toast.success('Profile image updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setShowCropper(false);
      setSelectedImage(null);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update profile image');
    }
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedFile: File) => {
    uploadImage.mutate(croppedFile);
  };

  return (
    <div className="relative group">
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={currentImageUrl || ''} alt="Profile" />
        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          {userInitials}
        </AvatarFallback>
      </Avatar>
      
      <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <Button
          size="sm"
          variant="ghost"
          className="text-white hover:bg-white/20 p-1"
          onClick={() => document.getElementById('avatar-upload')?.click()}
        >
          <Camera className="w-4 h-4" />
        </Button>
      </div>

      <input
        id="avatar-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      {selectedImage && (
        <ImageCropper
          isOpen={showCropper}
          onClose={() => {
            setShowCropper(false);
            setSelectedImage(null);
          }}
          imageSrc={selectedImage}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
};
