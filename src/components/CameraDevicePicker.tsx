import { Camera, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CameraDevice } from '@/hooks/useCamera';

interface CameraDevicePickerProps {
  devices: CameraDevice[];
  selectedDevice: string | null;
  onSelect: (deviceId: string) => void;
  onClose: () => void;
}

const CameraDevicePicker = ({ devices, selectedDevice, onSelect, onClose }: CameraDevicePickerProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 via-secondary/40 to-primary/40 rounded-2xl blur-xl opacity-60" />
        
        <div className="relative glass-panel rounded-2xl p-6 border border-primary/30">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                <Camera className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-display text-glow-subtle">Select Camera</h3>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={onClose}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Device List */}
          <div className="space-y-2">
            {devices.map((device, index) => (
              <button
                key={device.deviceId}
                onClick={() => onSelect(device.deviceId)}
                className={`w-full p-4 rounded-lg border transition-all duration-200 flex items-center justify-between group ${
                  selectedDevice === device.deviceId
                    ? 'bg-primary/10 border-primary/50 text-primary'
                    : 'bg-background/50 border-border/50 hover:bg-primary/5 hover:border-primary/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    selectedDevice === device.deviceId
                      ? 'bg-primary/20'
                      : 'bg-muted/50'
                  }`}>
                    <Camera className={`w-4 h-4 ${
                      selectedDevice === device.deviceId
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }`} />
                  </div>
                  <div className="text-left">
                    <p className={`font-medium ${
                      selectedDevice === device.deviceId
                        ? 'text-primary'
                        : 'text-foreground'
                    }`}>
                      {device.label || `Camera ${index + 1}`}
                    </p>
                    <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                      {device.deviceId.slice(0, 20)}...
                    </p>
                  </div>
                </div>

                {selectedDevice === device.deviceId && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Empty State */}
          {devices.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No cameras detected</p>
            </div>
          )}

          {/* Help Text */}
          <p className="text-xs text-muted-foreground/60 text-center mt-4">
            Select a camera to switch the video feed
          </p>
        </div>
      </div>
    </div>
  );
};

export default CameraDevicePicker;
