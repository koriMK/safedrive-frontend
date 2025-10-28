import { useState, useEffect } from 'react';
import { Upload, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { toast } from 'sonner';

export default function DocumentUpload({ onBack }) {
  const [documents, setDocuments] = useState({
    idCard: { file: null, uploaded: false, status: 'pending' },
    license: { file: null, uploaded: false, status: 'pending' },
    insurance: { file: null, uploaded: false, status: 'pending' },
    logbook: { file: null, uploaded: false, status: 'pending' }
  });
  
  const [vehicle, setVehicle] = useState({
    make: '',
    model: '',
    year: '',
    plate: '',
    color: ''
  });
  
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadDriverProfile();
  }, []);
  
  const loadDriverProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5002/api/v1/drivers/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        const profile = data.data;
        
        // Load vehicle information
        if (profile.vehicle) {
          setVehicle({
            make: profile.vehicle.make || '',
            model: profile.vehicle.model || '',
            year: profile.vehicle.year || '',
            plate: profile.vehicle.plate || '',
            color: profile.vehicle.color || ''
          });
        }
        
        // Load document status
        setDocuments({
          idCard: { 
            file: null, 
            uploaded: profile.documents?.idCard || false, 
            status: profile.documents?.idCard ? 'approved' : 'pending' 
          },
          license: { 
            file: null, 
            uploaded: profile.documents?.license || false, 
            status: profile.documents?.license ? 'approved' : 'pending' 
          },
          insurance: { 
            file: null, 
            uploaded: profile.documents?.insurance || false, 
            status: profile.documents?.insurance ? 'approved' : 'pending' 
          },
          logbook: { 
            file: null, 
            uploaded: profile.documents?.logbook || false, 
            status: profile.documents?.logbook ? 'approved' : 'pending' 
          }
        });
      }
    } catch (error) {
      console.error('Failed to load driver profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const documentTypes = [
    { key: 'idCard', label: 'National ID Card', required: true },
    { key: 'license', label: 'Driving License', required: true },
    { key: 'insurance', label: 'Vehicle Insurance', required: true },
    { key: 'logbook', label: 'Vehicle Logbook', required: false }
  ];

  const handleFileSelect = (type, file) => {
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }
    
    setDocuments(prev => ({
      ...prev,
      [type]: { ...prev[type], file }
    }));
  };

  const uploadDocument = async (type) => {
    const doc = documents[type];
    if (!doc.file) return;

    const formData = new FormData();
    formData.append('file', doc.file);
    formData.append('type', type);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5002/api/v1/drivers/upload-document', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        setDocuments(prev => ({
          ...prev,
          [type]: { ...prev[type], uploaded: true, status: 'approved' }
        }));
        toast.success(`${documentTypes.find(d => d.key === type)?.label} saved to database`);
        // Reload profile to get updated document status
        loadDriverProfile();
      } else {
        toast.error(data.error?.message || 'Failed to save document');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed');
    }
  };

  const updateVehicleInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5002/api/v1/drivers/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ vehicle })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Vehicle information saved to database');
        // Reload profile to get updated data
        loadDriverProfile();
      } else {
        toast.error(data.error?.message || 'Failed to save vehicle information');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to save vehicle information');
    }
  };

  const getStatusIcon = (doc) => {
    if (doc.uploaded && doc.status === 'approved') {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    if (doc.file && !doc.uploaded) {
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
    return <Upload className="w-5 h-5 text-gray-400" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-turquoise mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4 flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold">Driver Documents</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Vehicle Information */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Vehicle Information</h2>
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="Make (e.g., Toyota)"
              value={vehicle.make}
              onChange={(e) => setVehicle(prev => ({ ...prev, make: e.target.value }))}
            />
            <Input
              placeholder="Model (e.g., Corolla)"
              value={vehicle.model}
              onChange={(e) => setVehicle(prev => ({ ...prev, model: e.target.value }))}
            />
            <Input
              placeholder="Year"
              type="number"
              value={vehicle.year}
              onChange={(e) => setVehicle(prev => ({ ...prev, year: e.target.value }))}
            />
            <Input
              placeholder="License Plate"
              value={vehicle.plate}
              onChange={(e) => setVehicle(prev => ({ ...prev, plate: e.target.value.toUpperCase() }))}
            />
            <Input
              placeholder="Color"
              value={vehicle.color}
              onChange={(e) => setVehicle(prev => ({ ...prev, color: e.target.value }))}
              className="col-span-2"
            />
          </div>
          <Button 
            onClick={updateVehicleInfo}
            className="w-full mt-4 bg-turquoise hover:bg-turquoise/90"
            disabled={!vehicle.make || !vehicle.model || !vehicle.plate}
          >
            Update Vehicle Info
          </Button>
        </Card>

        {/* Document Upload */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Required Documents</h2>
          <div className="space-y-4">
            {documentTypes.map((docType) => {
              const doc = documents[docType.key];
              return (
                <div key={docType.key} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(doc)}
                      <span className="font-medium">{docType.label}</span>
                      {docType.required && <span className="text-red-500">*</span>}
                    </div>
                    <div className="text-sm text-gray-500">
                      {doc.uploaded ? 'Uploaded' : doc.file ? 'Ready to upload' : 'Not selected'}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileSelect(docType.key, e.target.files[0])}
                      className="flex-1"
                      disabled={doc.uploaded}
                    />
                    <Button
                      onClick={() => uploadDocument(docType.key)}
                      disabled={!doc.file || doc.uploaded}
                      size="sm"
                      className="bg-turquoise hover:bg-turquoise/90"
                    >
                      Upload
                    </Button>
                  </div>
                  
                  {doc.file && (
                    <p className="text-sm text-gray-500 mt-2">
                      Selected: {doc.file.name} ({(doc.file.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Status Summary */}
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Verification Status</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Documents Uploaded:</span>
              <span>{Object.values(documents).filter(d => d.uploaded).length}/4</span>
            </div>
            <div className="flex justify-between">
              <span>Vehicle Info:</span>
              <span>{vehicle.make && vehicle.plate ? 'Complete' : 'Incomplete'}</span>
            </div>
            <div className="flex justify-between">
              <span>Account Status:</span>
              <span className="text-yellow-600">Pending Review</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              Upload all required documents and complete vehicle information to get approved as a driver.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}