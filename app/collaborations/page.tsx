"use client";

import { useState, ChangeEvent } from "react";
import Link from "next/link";
import AdvancedBottomNav from "../../components/AdvancedBottomNav";
import logo_dark from "@/assetes/logo_dark.png";

interface Collaboration {
  id: number;
  businessName: string;
  businessLogo: string;
  title: string;
  date: string;
  status: "pending" | "approved" | "expired";
  uploadedImage?: string;
}

const initialCollaborations: Collaboration[] = [
  {
    id: 1,
    businessName: "Bella Vista Restaurant",
    businessLogo:
      "https://readdy.ai/api/search-image?query=Elegant%20restaurant%20logo%2C%20modern%20dining%20establishment%2C%20sophisticated%20branding%2C%20clean%20minimalist%20design%2C%20professional%20restaurant%20identity%2C%20upscale%20dining%20logo&width=60&height=60&seq=resto3&orientation=squarish",
    title: "Free 3-Course Dinner",
    date: "Dec 15, 2024",
    status: "pending",
  },
  {
    id: 2,
    businessName: "Café Mocha",
    businessLogo:
      "https://readdy.ai/api/search-image?query=Modern%20coffee%20shop%20logo%2C%20elegant%20caf%C3%A9%20branding%2C%20minimalist%20coffee%20brand%20identity%2C%20sophisticated%20caf%C3%A9%20logo%20design%2C%20premium%20coffee%20house%20branding&width=60&height=60&seq=cafe1&orientation=squarish",
    title: "Weekend Brunch Feature",
    date: "Dec 10, 2024",
    status: "pending",
  },
  {
    id: 3,
    businessName: "Luxe Beauty Salon",
    businessLogo:
      "https://readdy.ai/api/search-image?query=Modern%20beauty%20salon%20logo%2C%20elegant%20spa%20branding%2C%20luxury%20beauty%20brand%20identity%2C%20sophisticated%20salon%20logo%20design%2C%20premium%20beauty%20house%20branding&width=60&height=60&seq=beauty1&orientation=squarish",
    title: "Complete Hair Makeover",
    date: "Dec 5, 2024",
    status: "approved",
  },
  {
    id: 4,
    businessName: "Urban Threads",
    businessLogo:
      "https://readdy.ai/api/search-image?query=Modern%20fashion%20boutique%20logo%2C%20trendy%20clothing%20brand%20identity%2C%20urban%20fashion%20logo%2C%20stylish%20apparel%20branding%2C%20contemporary%20fashion%20design&width=60&height=60&seq=fashion2&orientation=squarish",
    title: "Designer Outfit Package",
    date: "Nov 20, 2024",
    status: "expired",
  },
];

export default function CollaborationsPage() {
  const [collaborations, setCollaborations] = useState<Collaboration[]>(initialCollaborations);
  const [selectedCollab, setSelectedCollab] = useState<Collaboration | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const pendingCollabs = collaborations.filter(c => c.status === "pending" && !c.uploadedImage);
  const approvedCollabs = collaborations.filter(c => c.status === "approved" && !c.uploadedImage);
  const expiredCollabs = collaborations.filter(c => c.status === "expired");
  const completedCollabs = collaborations.filter(c => c.uploadedImage);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result?.toString() ?? "";
      setUploadedImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitImage = () => {
    if (!uploadedImage || !selectedCollab) return;

    setCollaborations(prev =>
      prev.map(collab =>
        collab.id === selectedCollab.id
          ? { ...collab, uploadedImage, status: "approved" as const }
          : collab
      )
    );

    setShowUploadModal(false);
    setSelectedCollab(null);
    setUploadedImage(null);
  };

  const handlePendingClick = (collab: Collaboration) => {
    setSelectedCollab(collab);
    setShowUploadModal(true);
    setUploadedImage(collab.uploadedImage || null);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
      approved: "bg-green-100 text-green-700 border-green-300",
      expired: "bg-red-100 text-red-700 border-red-300",
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 px-6 pt-4 pb-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/influencer/dashboard">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
              <i className="ri-arrow-left-line text-white text-xl"></i>
            </div>
          </Link>
          <div className="flex flex-col items-center">
            <img 
              src={logo_dark.src}
              alt="Inshaar" 
              className="h-10 w-40 object-cover mb-1"
            />
            <span className="text-white/80 text-sm">My Collaborations</span>
          </div>
          <div className="w-10 h-10"></div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center border border-white/30">
            <div className="text-white text-2xl font-bold">{pendingCollabs.length}</div>
            <div className="text-white/80 text-xs">Pending</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center border border-white/30">
            <div className="text-white text-2xl font-bold">{approvedCollabs.length}</div>
            <div className="text-white/80 text-xs">Approved</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center border border-white/30">
            <div className="text-white text-2xl font-bold">{completedCollabs.length}</div>
            <div className="text-white/80 text-xs">Completed</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-8 max-w-4xl mx-auto">
        {/* Pending Section - First */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>Pending ({pendingCollabs.length})</span>
            </h2>
          </div>
          <div className="space-y-3">
            {pendingCollabs.map((collab) => (
              <div
                key={collab.id}
                onClick={() => handlePendingClick(collab)}
                className="bg-white rounded-2xl p-5 shadow-lg border-2 border-gray-100 hover:border-pink-300 hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={collab.businessLogo}
                    alt={collab.businessName}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-gray-100 group-hover:ring-pink-200 transition-all"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800 group-hover:text-pink-600 transition-colors">
                      {collab.businessName}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">{collab.title}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className="text-xs text-gray-500 flex items-center space-x-1">
                        <i className="ri-calendar-line"></i>
                        <span>{collab.date}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${getStatusBadge(collab.status)}`}>
                      {collab.status.toUpperCase()}
                        </span>
                    <i className="ri-arrow-right-line text-gray-400 group-hover:text-pink-500 transition-colors"></i>
                  </div>
                </div>
              </div>
            ))}
            {pendingCollabs.length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-2xl">
                <i className="ri-inbox-line text-4xl text-gray-300 mb-2"></i>
                <p className="text-gray-500 text-sm">No pending collaborations</p>
              </div>
            )}
          </div>
        </div>

        {/* Approved Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Approved ({approvedCollabs.length})</span>
            </h2>
          </div>
          <div className="space-y-3">
            {approvedCollabs.map((collab) => (
              <div
                key={collab.id}
                className="bg-white rounded-2xl p-5 shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={collab.businessLogo}
                    alt={collab.businessName}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-green-100"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800">
                      {collab.businessName}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">{collab.title}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className="text-xs text-gray-500 flex items-center space-x-1">
                        <i className="ri-calendar-line"></i>
                        <span>{collab.date}</span>
                      </span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${getStatusBadge(collab.status)}`}>
                    {collab.status.toUpperCase()}
                  </span>
                </div>
                {collab.uploadedImage && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <img
                      src={collab.uploadedImage}
                      alt="Uploaded proof"
                      className="w-full h-48 object-cover rounded-xl"
                    />
                  </div>
                )}
              </div>
            ))}
            {approvedCollabs.length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-2xl">
                <i className="ri-checkbox-circle-line text-4xl text-gray-300 mb-2"></i>
                <p className="text-gray-500 text-sm">No approved collaborations</p>
              </div>
            )}
          </div>
        </div>

        {/* Completed Section */}
        {completedCollabs.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Completed ({completedCollabs.length})</span>
              </h2>
                      </div>
            <div className="space-y-3">
              {completedCollabs.map((collab) => (
                <div
                  key={collab.id}
                  className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-5 shadow-lg border-2 border-purple-100"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={collab.businessLogo}
                      alt={collab.businessName}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-purple-200"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800">
                        {collab.businessName}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">{collab.title}</p>
                      <div className="flex items-center space-x-3 mt-2">
                        <span className="text-xs text-gray-500 flex items-center space-x-1">
                          <i className="ri-calendar-line"></i>
                          <span>{collab.date}</span>
                        </span>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border-2 border-green-300">
                      COMPLETED
                    </span>
                  </div>
                  {collab.uploadedImage && (
                    <div className="mt-4 pt-4 border-t border-purple-100">
                      <p className="text-xs text-gray-500 mb-2 font-medium">Uploaded Proof:</p>
                      <img
                        src={collab.uploadedImage}
                        alt="Uploaded proof"
                        className="w-full h-48 object-cover rounded-xl shadow-md"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expired Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>Expired ({expiredCollabs.length})</span>
            </h2>
          </div>
          <div className="space-y-3">
            {expiredCollabs.map((collab) => (
              <div
                key={collab.id}
                className="bg-white rounded-2xl p-5 shadow-lg border-2 border-gray-100 opacity-75"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={collab.businessLogo}
                    alt={collab.businessName}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-red-100 grayscale"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-600">
                      {collab.businessName}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">{collab.title}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className="text-xs text-gray-400 flex items-center space-x-1">
                        <i className="ri-calendar-line"></i>
                        <span>{collab.date}</span>
                      </span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${getStatusBadge(collab.status)}`}>
                    {collab.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
            {expiredCollabs.length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-2xl">
                <i className="ri-time-line text-4xl text-gray-300 mb-2"></i>
                <p className="text-gray-500 text-sm">No expired collaborations</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Image Modal */}
      {showUploadModal && selectedCollab && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Upload Proof</h3>
                <p className="text-gray-500 text-sm mt-1">{selectedCollab.businessName}</p>
              </div>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedCollab(null);
                  setUploadedImage(null);
                }}
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <i className="ri-close-line text-gray-600"></i>
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-4 mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">{selectedCollab.title}</h4>
                <p className="text-gray-600 text-sm">{selectedCollab.businessName}</p>
                <p className="text-gray-500 text-xs mt-2">Date: {selectedCollab.date}</p>
              </div>

              <label className="block mb-3">
                <span className="text-sm font-semibold text-gray-800 mb-2 block">Upload Image</span>
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-pink-400 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    {uploadedImage ? (
                      <div>
                        <img
                          src={uploadedImage}
                          alt="Uploaded"
                          className="w-full h-64 object-cover rounded-xl mb-4"
                        />
                        <p className="text-sm text-green-600 font-medium">Image uploaded successfully!</p>
                      </div>
                    ) : (
                      <div>
                        <i className="ri-image-add-line text-4xl text-gray-400 mb-3"></i>
                        <p className="text-gray-600 font-medium mb-1">Tap to upload image</p>
                        <p className="text-gray-400 text-xs">Upload your collaboration proof</p>
                      </div>
                    )}
                  </label>
                </div>
              </label>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedCollab(null);
                  setUploadedImage(null);
                }}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitImage}
                disabled={!uploadedImage}
                className="flex-1 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Bottom Navigation */}
      <AdvancedBottomNav userType="influencer" />
    </div>
  );
}
