"use client";

import { useState, ChangeEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdvancedBottomNav from "../../components/AdvancedBottomNav";
import white_logo from "@/assetes/white-logo.png";
import InfluencerQRCode from "../../components/InfluencerQRCode";
import { getInfluencerCollaborations } from "@/lib/supabase-collaborations";
import { getInfluencerApplications } from "@/lib/supabase-applications";
import { getCurrentUser } from "@/lib/supabase-auth";
import type { Collaboration as SupabaseCollaboration } from "@/lib/supabase-collaborations";
import type { Application } from "@/lib/supabase-applications";

interface Collaboration {
  id: string;
  collaborationId?: string; // set when from collaborations table (for QR)
  businessName: string;
  businessLogo: string;
  title: string;
  date: string;
  time?: string;
  status: "pending" | "approved" | "expired" | "completed" | "active";
  uploadedImage?: string;
  businessId?: string;
  visitInfo?: {
    arrivalTime: string;
    isOnTime: boolean;
    checkedIn: boolean;
  };
}

export default function CollaborationsPage() {
  const router = useRouter();
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCollab, setSelectedCollab] = useState<Collaboration | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [showQRModalCollab, setShowQRModalCollab] = useState<Collaboration | null>(null);

  // Fetch collaborations and applications
  useEffect(() => {
    async function fetchData() {
      // Check authentication
      const { data: user, error: authError } = await getCurrentUser();
      if (authError || !user) {
        router.push('/auth');
        return;
      }

      try {
        // Fetch collaborations
        const { data: collabs, error: collabError } = await getInfluencerCollaborations();
        if (collabError) {
          console.error('Error fetching collaborations:', collabError);
        }

        // Fetch applications
        const { data: applications, error: appError } = await getInfluencerApplications();
        if (appError) {
          console.error('Error fetching applications:', appError);
        }

        // Combine and transform data
        const allItems: Collaboration[] = [];

        // Add applications as pending/approved
        if (applications) {
          applications.forEach((app: Application) => {
            const offer = app.offer as any;
            const business = offer?.business || {};
            allItems.push({
              id: app.id,
              businessName: business.business_name || offer?.business_name || 'Business',
              businessLogo: business.business_logo || offer?.business_logo || 'https://picsum.photos/60/60',
              title: offer?.title || 'Offer',
              date: app.scheduled_date ? new Date(app.scheduled_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : new Date(app.applied_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              time: app.scheduled_time || undefined,
              status: app.status === 'accepted' ? 'approved' : app.status === 'declined' ? 'expired' : 'pending',
              businessId: offer?.business_id
            });
          });
        }

        // Add collaborations (id is collaboration id for QR)
        if (collabs) {
          collabs.forEach((collab: SupabaseCollaboration) => {
            const offer = collab.offer as any;
            const business = (collab.business as any) || {};
            allItems.push({
              id: collab.id,
              collaborationId: collab.id,
              businessName: business.business_name || 'Business',
              businessLogo: business.business_logo || 'https://picsum.photos/60/60',
              title: offer?.title || 'Collaboration',
              date: new Date(collab.scheduled_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              time: collab.scheduled_time,
              status: collab.status === 'completed' ? 'completed' : collab.status === 'active' ? 'approved' : collab.status as any,
              uploadedImage: collab.proof_image_url,
              businessId: collab.business_id,
              visitInfo: collab.checked_in_at ? {
                arrivalTime: collab.checked_in_at,
                isOnTime: collab.is_on_time || false,
                checkedIn: true
              } : undefined
            });
          });
        }

        setCollaborations(allItems);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [router]);

  const pendingCollabs = collaborations.filter(c => c.status === "pending" && !c.uploadedImage);
  const approvedCollabs = collaborations.filter(c => (c.status === "approved" || c.status === "active") && !c.uploadedImage);
  const expiredCollabs = collaborations.filter(c => c.status === "expired");
  const completedCollabs = collaborations.filter(c => c.uploadedImage || c.status === "completed");

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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

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
              src={white_logo.src}
              alt="Inshaar"
              className="h-12 w-40 object-cover mb-1"
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
                className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border-2 border-gray-100 hover:border-pink-300 hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
              >
                <div className="flex flex-wrap items-start gap-3 sm:gap-4">
                  <img
                    src={collab.businessLogo}
                    alt={collab.businessName}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover ring-2 ring-gray-100 group-hover:ring-pink-200 transition-all flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base sm:text-lg text-gray-800 group-hover:text-pink-600 transition-colors truncate">
                      {collab.businessName}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1 truncate">{collab.title}</p>
                    <div className="flex items-center space-x-3 mt-2 flex-wrap gap-y-1">
                      <span className="text-xs text-gray-500 flex items-center space-x-1">
                        <i className="ri-calendar-line"></i>
                        <span>{collab.date}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto sm:flex-col sm:items-end">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border-2 ${getStatusBadge(collab.status)}`}>
                      {collab.status.toUpperCase()}
                    </span>
                    <i className="ri-arrow-right-line text-gray-400 group-hover:text-pink-500 transition-colors ml-auto sm:ml-0"></i>
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
                className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="flex flex-wrap items-start gap-3 sm:gap-4">
                  <img
                    src={collab.businessLogo}
                    alt={collab.businessName}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover ring-2 ring-green-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base sm:text-lg text-gray-800 truncate">
                      {collab.businessName}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1 truncate">{collab.title}</p>
                    <div className="flex items-center space-x-3 mt-2 flex-wrap gap-y-1">
                      <span className="text-xs text-gray-500 flex items-center space-x-1">
                        <i className="ri-calendar-line"></i>
                        <span>{collab.date}</span>
                      </span>
                      {collab.time && (
                        <span className="text-xs text-gray-500 flex items-center space-x-1">
                          <i className="ri-time-line"></i>
                          <span>{collab.time}</span>
                        </span>
                      )}
                    </div>
                    {collab.visitInfo?.checkedIn && (
                      <div className="mt-2 flex items-center space-x-2 flex-wrap">
                        <span className={`text-xs px-2 py-1 rounded-full ${collab.visitInfo.isOnTime
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                          }`}>
                          <i className={`ri-${collab.visitInfo.isOnTime ? 'check' : 'time'}-line mr-1`}></i>
                          {collab.visitInfo.isOnTime ? 'Checked In (On Time)' : 'Checked In (Late)'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(collab.visitInfo.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0 w-full sm:w-auto flex justify-between sm:flex-col sm:items-end sm:justify-start gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border-2 ${getStatusBadge(collab.status)}`}>
                      {collab.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                {collab.status === "approved" && collab.collaborationId && !collab.visitInfo?.checkedIn && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-gray-600 text-sm mb-2">Show this QR to the business when you arrive.</p>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setShowQRModalCollab(collab); }}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                    >
                      <i className="ri-qr-scan-line text-xl"></i>
                      <span>Show my QR</span>
                    </button>
                  </div>
                )}
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
                  <div className="flex flex-wrap items-start gap-3 sm:gap-4">
                    <img
                      src={collab.businessLogo}
                      alt={collab.businessName}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover ring-2 ring-purple-200 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base sm:text-lg text-gray-800 truncate">
                        {collab.businessName}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1 truncate">{collab.title}</p>
                      <div className="flex items-center space-x-3 mt-2 flex-wrap">
                        <span className="text-xs text-gray-500 flex items-center space-x-1">
                          <i className="ri-calendar-line"></i>
                          <span>{collab.date}</span>
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border-2 border-green-300 flex-shrink-0">
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
                <div className="flex flex-wrap items-start gap-3 sm:gap-4">
                  <img
                    src={collab.businessLogo}
                    alt={collab.businessName}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover ring-2 ring-red-100 grayscale flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base sm:text-lg text-gray-600 truncate">
                      {collab.businessName}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1 truncate">{collab.title}</p>
                    <div className="flex items-center space-x-3 mt-2 flex-wrap">
                      <span className="text-xs text-gray-400 flex items-center space-x-1">
                        <i className="ri-calendar-line"></i>
                        <span>{collab.date}</span>
                      </span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border-2 flex-shrink-0 ${getStatusBadge(collab.status)}`}>
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

      {/* Full-screen QR modal (unique per approved card) */}
      {showQRModalCollab && showQRModalCollab.collaborationId && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">Check-in QR — {showQRModalCollab.businessName}</h3>
              <button
                type="button"
                onClick={() => setShowQRModalCollab(null)}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
              >
                <i className="ri-close-line text-gray-600 text-xl"></i>
              </button>
            </div>
            <InfluencerQRCode
              collaborationId={showQRModalCollab.collaborationId}
              businessName={showQRModalCollab.businessName}
              title="Show this to the business to scan"
            />
            <button
              type="button"
              onClick={() => setShowQRModalCollab(null)}
              className="w-full mt-4 py-3 rounded-xl bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

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
