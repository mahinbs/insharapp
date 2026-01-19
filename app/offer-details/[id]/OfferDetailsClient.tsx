"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import logo_dark from "@/assetes/logo_dark.png";
import { getOfferById } from "@/lib/supabase-offers";
import { applyToOffer, getApplicationStatus } from "@/lib/supabase-applications";
import { getCurrentUser } from "@/lib/supabase-auth";
import { submitContentProof, getInfluencerCollaborations } from "@/lib/supabase-collaborations";
import type { Offer } from "@/lib/supabase-offers";
import type { Application } from "@/lib/supabase-applications";
import type { Collaboration } from "@/lib/supabase-collaborations";

const reviews = [
  {
    id: 1,
    influencerName: "Emma Style",
    username: "@emmastyle",
    rating: 5,
    comment:
      "Amazing experience! The food was incredible and the staff was so welcoming. Great collaboration!",
    profileImage:
      "https://readdy.ai/api/search-image?query=Young%20female%20lifestyle%20influencer%2C%20professional%20headshot%2C%20confident%20smile%2C%20modern%20portrait%20photography%2C%20bright%20natural%20lighting%2C%20social%20media%20personality&width=50&height=50&seq=reviewer1&orientation=squarish",
  },
  {
    id: 2,
    influencerName: "Food Explorer",
    username: "@foodexplorer",
    rating: 5,
    comment:
      "Perfect partnership! The restaurant exceeded all expectations. Highly recommend for food influencers.",
    profileImage:
      "https://readdy.ai/api/search-image?query=Young%20male%20food%20influencer%2C%20professional%20headshot%2C%20friendly%20expression%2C%20modern%20portrait%20photography%2C%20natural%20lighting%2C%20food%20blogger%20personality&width=50&height=50&seq=reviewer2&orientation=squarish",
  },
];

// Business Dashboard Data
const socialLinks = [
  { id: 'website', icon: 'ri-earth-line', label: 'www.bellavista.com', href: 'https://www.bellavista.com/' },
  { id: 'instagram', icon: 'ri-instagram-line', label: '@bellavista', href: 'https://www.instagram.com/bellavista' },
  { id: 'tiktok', icon: 'ri-tiktok-fill', label: '@bellavista', href: 'https://www.tiktok.com/@bellavista' },
];

const contentHighlights = [
  { title: 'Seasonal Menu', description: 'Locally sourced ingredients with innovative culinary techniques.' },
  { title: 'Wine Pairing', description: 'Expertly curated wine selection to complement each course.' },
  { title: 'Fine Dining Experience', description: 'Elegant atmosphere with exceptional service.' },
];

const galleryItems = [
  'https://readdy.ai/api/search-image?query=Gourmet%20restaurant%20meal%2C%20beautifully%20plated%20fine%20dining%20dish%2C%20elegant%20food%20presentation%2C%20professional%20food%20photography%2C%20warm%20restaurant%20lighting%2C%20luxury%20dining%20experience&width=900&height=900&seq=gallery1&orientation=square',
  'https://readdy.ai/api/search-image?query=Elegant%20restaurant%20interior%2C%20fine%20dining%20atmosphere%2C%20sophisticated%20table%20setting%2C%20warm%20ambient%20lighting%2C%20luxury%20restaurant%20decor%2C%20upscale%20dining%20room&width=900&height=900&seq=gallery2&orientation=square',
  'https://readdy.ai/api/search-image?query=Professional%20chef%20preparing%20gourmet%20dish%2C%20culinary%20artistry%2C%20kitchen%20expertise%2C%20fine%20dining%20preparation%2C%20chef%20at%20work%20in%20restaurant%20kitchen&width=900&height=900&seq=gallery3&orientation=square',
  'https://readdy.ai/api/search-image?query=Beautiful%20restaurant%20dessert%2C%20artisanal%20pastry%2C%20fine%20dining%20presentation%2C%20elegant%20plating%2C%20luxury%20culinary%20experience&width=900&height=900&seq=gallery4&orientation=square',
];

const videoShowcase = [
  'https://player.vimeo.com/video/76979871?h=8272103f6e',
  'https://player.vimeo.com/video/22439234?h=7d45d2d4d3',
];

const weeklyTimings = [
  { day: 'Monday', value: '11:00 - 22:00' },
  { day: 'Tuesday', value: '11:00 - 22:00' },
  { day: 'Wednesday', value: '11:00 - 22:00' },
  { day: 'Thursday', value: '11:00 - 23:00' },
  { day: 'Friday', value: '11:00 - 23:00' },
  { day: 'Saturday', value: '12:00 - 23:00' },
  { day: 'Sunday', value: '12:00 - 21:00' },
];

const establishments = [
  {
    id: 'downtown',
    title: 'Bella Vista Restaurant • Downtown',
    address: '123 Main Street, Downtown Plaza',
    contact: '+1 (555) 123-4567',
  },
  {
    id: 'uptown',
    title: 'Bella Vista Restaurant • Uptown',
    address: '456 Park Avenue, Uptown District',
    contact: '+1 (555) 987-6543',
  },
];

const creatorWorkExamples = [
  {
    id: 1,
    creatorName: "Sarah Foodie",
    username: "@sarahfoodie",
    profileImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    postImage:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=400&fit=crop",
    likes: "2.3K",
    engagement: "High",
  },
  {
    id: 2,
    creatorName: "Mike Tastes",
    username: "@miketastes",
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    postImage:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=400&fit=crop",
    likes: "1.8K",
    engagement: "High",
  },
  {
    id: 3,
    creatorName: "Lifestyle Lux",
    username: "@lifestylelux",
    profileImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    postImage:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=400&fit=crop",
    likes: "3.1K",
    engagement: "Very High",
  },
  {
    id: 4,
    creatorName: "Chef Stories",
    username: "@chefstories",
    profileImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    postImage:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop",
    likes: "2.7K",
    engagement: "High",
  },
  {
    id: 5,
    creatorName: "Dine & Design",
    username: "@dineanddesign",
    profileImage:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    postImage:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=400&fit=crop",
    likes: "1.9K",
    engagement: "High",
  },
  {
    id: 6,
    creatorName: "Taste Buds",
    username: "@tastebuds",
    profileImage:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
    postImage:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop",
    likes: "2.5K",
    engagement: "High",
  },
];

type RequestStatus = "pending" | "accepted" | "declined" | "cancelled";

interface StoredRequest {
  offerId: string;
  businessName: string;
  status: RequestStatus;
  createdAt: string;
}

interface VideoSubmissionRecord {
  offerId: string;
  fileName: string;
  dataUrl: string;
  socialLink: string;
  hasTaggedBusiness: boolean;
  hasSentCollabRequest: boolean;
  submittedAt: string;
}

const REQUEST_STORAGE_KEY = "inshaar_collab_requests";
const VIDEO_STORAGE_KEY = "inshaar_video_submissions";

const isBrowser = () => typeof window !== "undefined";

const safeParse = <T,>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.warn("Failed to parse stored JSON", error);
    return fallback;
  }
};

const getStoredRequests = (): StoredRequest[] => {
  if (!isBrowser()) return [];
  return safeParse<StoredRequest[]>(localStorage.getItem(REQUEST_STORAGE_KEY), []);
};

const persistRequests = (requests: StoredRequest[]) => {
  if (!isBrowser()) return;
  localStorage.setItem(REQUEST_STORAGE_KEY, JSON.stringify(requests));
  window.dispatchEvent(new Event("collab-request-updated"));
};

const persistRequestStatus = (
  offerId: string,
  businessName: string,
  status: RequestStatus
) => {
  if (!isBrowser()) return;
  const requests = getStoredRequests();
  const index = requests.findIndex((req) => req.offerId === offerId);
  const baseRecord: StoredRequest = {
    offerId,
    businessName,
    status,
    createdAt: new Date().toISOString(),
  };

  let updatedRequests =
    index >= 0 ? requests.map((req) => (req.offerId === offerId ? { ...req, status } : req)) : [...requests, baseRecord];

  if (status === "accepted") {
    updatedRequests = updatedRequests.map((req) =>
      req.offerId === offerId
        ? req
        : req.status === "pending"
        ? { ...req, status: "cancelled" }
        : req
    );
  }

  persistRequests(updatedRequests);
};

const removeRequestRecord = (offerId: string) => {
  if (!isBrowser()) return;
  const remaining = getStoredRequests().filter((req) => req.offerId !== offerId);
  persistRequests(remaining);
};

const getStoredVideoSubmissions = (): VideoSubmissionRecord[] => {
  if (!isBrowser()) return [];
  return safeParse<VideoSubmissionRecord[]>(localStorage.getItem(VIDEO_STORAGE_KEY), []);
};

const saveVideoSubmissionRecord = (record: VideoSubmissionRecord) => {
  if (!isBrowser()) return;
  const submissions = getStoredVideoSubmissions();
  const index = submissions.findIndex((item) => item.offerId === record.offerId);
  const next =
    index >= 0
      ? submissions.map((item) => (item.offerId === record.offerId ? record : item))
      : [...submissions, record];
  localStorage.setItem(VIDEO_STORAGE_KEY, JSON.stringify(next));
};

const getVideoSubmissionForOffer = (offerId: string) => {
  return getStoredVideoSubmissions().find((item) => item.offerId === offerId);
};

interface OfferDetailsClientProps {
  offerId: string;
}

type SectionId =
  | 'offers'
  | 'information'
  | 'content'
  | 'gallery'
  | 'location'
  | 'timing'
  | 'establishment';

const sectionOrder: SectionId[] = [
  'information',
  'content',
  'offers',
  'gallery',
  'location',
  'timing',
  'establishment',
];

export default function OfferDetailsClient({
  offerId,
}: OfferDetailsClientProps) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedPeople, setSelectedPeople] = useState<number>(0);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [acceptedConditions, setAcceptedConditions] = useState({
    checkDeal: false,
    respectDateTime: false,
    postContent: false
  });
  const [bookingStatus, setBookingStatus] = useState<
    RequestStatus | null
  >(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<
    "success" | "warning" | "error"
  >("success");
  const [videoUploadStatus, setVideoUploadStatus] = useState<
    "idle" | "uploading" | "uploaded"
  >("idle");
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [videoFileName, setVideoFileName] = useState("");
  const [socialLink, setSocialLink] = useState("");
  const [hasTaggedBusiness, setHasTaggedBusiness] = useState(false);
  const [hasSentCollabRequest, setHasSentCollabRequest] = useState(false);
  const [proofSaved, setProofSaved] = useState(false);
  const cancellationNoticeRef = useRef(false);
  const [activeTab, setActiveTab] = useState<SectionId>('information');
  // Backend-integrated state
  const [loading, setLoading] = useState(true);
  const [offerDetails, setOfferDetails] = useState<any>(null);
  const [application, setApplication] = useState<Application | null>(null);
  const [collaboration, setCollaboration] = useState<Collaboration | null>(null);
  // Frontend creator content toggle
  const [showAllCreatorWork, setShowAllCreatorWork] = useState(false);
  const sectionsRef = useRef<Record<SectionId, HTMLDivElement | null>>({
    offers: null,
    information: null,
    content: null,
    gallery: null,
    location: null,
    timing: null,
    establishment: null,
  });
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Generate available time slots
  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
    "8:00 PM",
  ];

  // Get available months (current month + next 11 months)
  const getAvailableMonths = () => {
    const months = [];
    const today = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
      months.push({
        value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
        label: date.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        month: date.getMonth() + 1,
        year: date.getFullYear()
      });
    }
    return months;
  };

  // Get available dates for selected month
  const getAvailableDatesForMonth = () => {
    if (!selectedMonth) return [];
    const [year, month] = selectedMonth.split('-').map(Number);
    const dates = [];
    const daysInMonth = new Date(year, month, 0).getDate();
    const today = new Date();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      // Only show future dates
      if (date >= today) {
        dates.push(date.toISOString().split("T")[0]);
      }
    }
    return dates;
  };

  const availableMonths = getAvailableMonths();
  const availableDates = getAvailableDatesForMonth();

  // Fetch offer data and application status
  useEffect(() => {
    async function fetchData() {
      // Check authentication
      const { data: user, error: authError } = await getCurrentUser();
      if (authError || !user) {
        router.push('/auth');
        return;
      }

      // Fetch offer details
      const { data: offer, error: offerError } = await getOfferById(offerId);
      if (offerError) {
        setNotificationMessage('Failed to load offer details');
        setNotificationType('error');
        setShowNotification(true);
        setLoading(false);
        return;
      }

      if (offer) {
        setOfferDetails(offer);
      }

      // Fetch application status
      const { data: appData, error: appError } = await getApplicationStatus(offerId);
      if (!appError && appData) {
        setApplication(appData);
        setBookingStatus(appData.status as RequestStatus);
      }

      // Fetch collaboration if application is accepted
      if (appData?.status === 'accepted') {
        const { data: collabs, error: collabError } = await getInfluencerCollaborations();
        if (!collabError && collabs) {
          const collab = collabs.find(c => c.offer_id === offerId);
          if (collab) {
            setCollaboration(collab);
            // Load saved content if exists
            if (collab.content_video_url) {
              setVideoPreviewUrl(collab.content_video_url);
              setVideoUploadStatus('uploaded');
              setVideoFileName(collab.content_video_filename || '');
              setSocialLink(collab.social_media_post_url || '');
              setHasTaggedBusiness(collab.has_tagged_business);
              setHasSentCollabRequest(collab.has_sent_collab_request);
              setProofSaved(!!collab.content_submitted_at);
            }
          }
        }
      }

      setLoading(false);
    }

    fetchData();
  }, [offerId, router]);

  useEffect(() => {
    if (!isBrowser()) return;
    const savedSubmission = getVideoSubmissionForOffer(offerId);
    if (savedSubmission) {
      setVideoPreviewUrl(savedSubmission.dataUrl);
      setVideoUploadStatus("uploaded");
      setVideoFileName(savedSubmission.fileName);
      setSocialLink(savedSubmission.socialLink);
      setHasTaggedBusiness(savedSubmission.hasTaggedBusiness);
      setHasSentCollabRequest(savedSubmission.hasSentCollabRequest);
      setProofSaved(true);
    } else {
      setVideoPreviewUrl(null);
      setVideoUploadStatus("idle");
      setVideoFileName("");
      setProofSaved(false);
      setHasTaggedBusiness(false);
      setHasSentCollabRequest(false);
    }
  }, [offerId]);

  const handleTabClick = (id: SectionId) => {
    const section = sectionsRef.current[id];
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setActiveTab(id);
  };

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => sectionOrder.indexOf(a.target.id as SectionId) - sectionOrder.indexOf(b.target.id as SectionId));
        if (visible[0]) {
          const visibleId = visible[0].target.id as SectionId;
          setActiveTab(visibleId);
        }
      },
      {
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0.2,
      }
    );

    sectionOrder.forEach((id) => {
      const section = sectionsRef.current[id];
      if (section) {
        observerRef.current?.observe(section);
      }
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const registerSectionRef = (id: SectionId) => (el: HTMLDivElement | null) => {
    sectionsRef.current[id] = el;
  };

  const sectionClasses = 'rounded-3xl bg-white/90 backdrop-blur px-5 py-6 shadow-lg border border-white/60 mb-4';

  const updateRequestStatus = async (status: RequestStatus) => {
    // Status is updated via Supabase, no need for localStorage
    setBookingStatus(status);
  };

  const resetCurrentRequest = () => {
    removeRequestRecord(offerId);
    setBookingStatus(null);
    setSelectedPeople(0);
    setSelectedMonth("");
    setSelectedDate("");
    setSelectedTime("");
  };

  const handleVideoSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setVideoUploadStatus("uploading");
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result?.toString() ?? "";
      setVideoPreviewUrl(result);
      setVideoFileName(file.name);
      setVideoUploadStatus("uploaded");
      setProofSaved(false);
    };
    reader.onerror = () => {
      setVideoUploadStatus("idle");
      setNotificationMessage("Unable to read the selected video, please try a different file.");
      setNotificationType("error");
      setShowNotification(true);
    };
    reader.readAsDataURL(file);
  };

  const handleProofSubmission = async () => {
    if (videoUploadStatus !== "uploaded" || !videoPreviewUrl) {
      setNotificationMessage("Please upload the collaboration video before submitting.");
      setNotificationType("warning");
      setShowNotification(true);
      return;
    }

    if (!socialLink.trim()) {
      setNotificationMessage("Add the social media post link that includes the tag and collaboration request.");
      setNotificationType("warning");
      setShowNotification(true);
      return;
    }

    if (!hasTaggedBusiness || !hasSentCollabRequest) {
      setNotificationMessage("Confirm that you tagged the business and sent the collaboration request on social media.");
      setNotificationType("warning");
      setShowNotification(true);
      return;
    }

    if (!collaboration) {
      setNotificationMessage("Collaboration not found. Please try again.");
      setNotificationType("error");
      setShowNotification(true);
      return;
    }

    try {
      const { data, error } = await submitContentProof(collaboration.id, {
        videoUrl: videoPreviewUrl,
        videoFilename: videoFileName || "collaboration-video.mp4",
        socialMediaPostUrl: socialLink.trim(),
        hasTaggedBusiness,
        hasSentCollabRequest,
        proofImageUrl: videoPreviewUrl // Using video URL as proof for now
      });

      if (error) {
        setNotificationMessage(error.message || "Failed to submit proof");
        setNotificationType("error");
        setShowNotification(true);
        return;
      }

      setProofSaved(true);
      setCollaboration(data);
      setNotificationMessage("Great! Your video proof is stored and ready for the business to download.");
      setNotificationType("success");
      setShowNotification(true);
    } catch (err: any) {
      setNotificationMessage(err.message || "An error occurred");
      setNotificationType("error");
      setShowNotification(true);
    }
  };

  const handleBookingSubmit = () => {
    if (!selectedPeople || !selectedDate || !selectedTime) {
      setNotificationMessage("Please select number of people, date, and time");
      setNotificationType("warning");
      setShowNotification(true);
      return;
    }

    // Show confirmation modal instead of submitting directly
    setShowBookingModal(false);
    setShowConfirmationModal(true);
  };

  const handleConfirmBooking = async () => {
    // Check if all conditions are accepted
    if (!acceptedConditions.checkDeal || !acceptedConditions.respectDateTime || !acceptedConditions.postContent) {
      setNotificationMessage("Please accept all conditions to continue");
      setNotificationType("warning");
      setShowNotification(true);
      return;
    }

    try {
      // Submit application to Supabase
      const { data, error } = await applyToOffer({
        offerId,
        scheduledDate: selectedDate,
        scheduledTime: selectedTime,
        numberOfPeople: selectedPeople
      });

      if (error) {
        setNotificationMessage(error.message || "Failed to submit application");
        setNotificationType("error");
        setShowNotification(true);
        return;
      }

      setBookingStatus("pending");
      setApplication(data);
      setShowConfirmationModal(false);
      setNotificationMessage(
        "Booking request sent! Waiting for business confirmation."
      );
      setNotificationType("success");
      setShowNotification(true);

      // Reset conditions
      setAcceptedConditions({
        checkDeal: false,
        respectDateTime: false,
        postContent: false
      });
    } catch (err: any) {
      setNotificationMessage(err.message || "An error occurred");
      setNotificationType("error");
      setShowNotification(true);
    }
  };

  const showNotificationComponent = () => {
    if (!showNotification) return null;

    const bgColor =
      notificationType === "success"
        ? "bg-green-500"
        : notificationType === "warning"
        ? "bg-yellow-500"
        : "bg-red-500";
    const icon =
      notificationType === "success"
        ? "ri-check-line"
        : notificationType === "warning"
        ? "ri-alert-line"
        : "ri-close-line";

    return (
      <div className="fixed top-4 right-4 z-50 animate-slide-in">
        <div
          className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-sm`}
        >
          <i className={`${icon} text-xl`}></i>
          <p className="text-sm font-medium">{notificationMessage}</p>
          <button
            onClick={() => setShowNotification(false)}
            className="ml-2 text-white/80 hover:text-white"
          >
            <i className="ri-close-line"></i>
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!offerDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-error-warning-line text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Offer not found</h3>
          <Link href="/influencer/dashboard" className="text-pink-500 hover:text-pink-600">
            Go back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  const business = offerDetails.business || {};
  const images = offerDetails.images || [];
  const requirements = offerDetails.requirements || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 px-6 pt-4 pb-4">
        <div className="flex items-center justify-between">
          <Link href="/influencer/dashboard">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <i className="ri-arrow-left-line text-white text-xl"></i>
            </div>
          </Link>
          <div className=" flex flex-col items-center">
            <img 
              src={logo_dark.src}
              alt="Inshaar" 
              className="h-10 w-40 object-cover mb-1"
            />
            <span className="text-white/80 text-sm">Offer Details</span>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <i className="ri-heart-line text-white text-xl"></i>
          </div>
        </div>
      </div>

      {/* Image Carousel */}
      {images.length > 0 && (
        <div className="relative">
          <div className="h-64 overflow-hidden">
            <img
              src={images[currentImageIndex] || offerDetails.main_image || 'https://picsum.photos/400/300'}
              alt="Offer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Image indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((_: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Business Info Header */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <img
            src={business.business_logo || offerDetails.business_logo || 'https://picsum.photos/80/80'}
            alt={business.business_name || offerDetails.business_name || 'Business'}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <h2 className="font-bold text-xl text-gray-800">
              {business.business_name || offerDetails.business_name || 'Business'}
            </h2>
            <p className="text-gray-600">
              {offerDetails.category} • {offerDetails.location}
            </p>
            <div className="flex items-center space-x-4 mt-1">
              <div className="flex items-center space-x-1">
                <i className="ri-star-fill text-yellow-400"></i>
                <span className="text-sm font-medium">
                  {business.rating || offerDetails.business?.rating || '0.0'}
                </span>
              </div>
              <span className="text-gray-500 text-sm">
                {business.total_collaborations || 0} collaborations
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="px-4 py-2">
          <div className="flex rounded-3xl bg-gray-100 p-1 shadow-inner overflow-x-auto no-scrollbar">
            {[
              { id: 'information', label: 'Information' },
              { id: 'content', label: 'Content' },
              { id: 'offers', label: 'Offers' },
              { id: 'gallery', label: 'Gallery' },
              { id: 'location', label: 'Location' },
              { id: 'timing', label: 'Timing' },
              { id: 'establishment', label: 'Establishment' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id as SectionId)}
                className={`flex-1 whitespace-nowrap rounded-2xl py-3 px-2 text-xs font-semibold transition ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white shadow-lg'
                    : 'text-gray-500'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content with Tabs */}
      <div className="px-4 py-5 pb-24 bg-gray-50/60">
        {/* Information Section */}
        <section id="information" ref={registerSectionRef('information')} className={sectionClasses}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-pink-500">Information</p>
              <h3 className="text-xl font-semibold text-slate-900">About {offerDetails.businessName}</h3>
            </div>
            <span className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-medium px-3 py-1">
              Open
            </span>
          </div>
              <p className="text-sm text-slate-600 leading-6">
            {business.business_name || offerDetails.business_name} is a premium {offerDetails.category.toLowerCase()} located in {offerDetails.location}.
            {offerDetails.description && ` ${offerDetails.description.split('.')[0]}.`}
          </p>
          {(business.business_website || business.business_instagram || business.business_tiktok) && (
            <div className="mt-5 grid gap-3">
              {business.business_website && (
                <a
                  href={business.business_website}
                  className="flex items-center justify-between rounded-2xl border border-white/40 px-4 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white"
                  target="_blank"
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-2xl bg-white/20 text-white flex items-center justify-center">
                      <i className="ri-earth-line text-lg"></i>
                    </div>
                    <span className="text-sm font-medium">{business.business_website}</span>
                  </div>
                  <i className="ri-arrow-right-up-line text-xs text-white/80"></i>
                </a>
              )}
              {business.business_instagram && (
                <a
                  href={`https://instagram.com/${business.business_instagram.replace('@', '')}`}
                  className="flex items-center justify-between rounded-2xl border border-white/40 px-4 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white"
                  target="_blank"
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-2xl bg-white/20 text-white flex items-center justify-center">
                      <i className="ri-instagram-line text-lg"></i>
                    </div>
                    <span className="text-sm font-medium">{business.business_instagram}</span>
                  </div>
                  <i className="ri-arrow-right-up-line text-xs text-white/80"></i>
                </a>
              )}
              {business.business_tiktok && (
                <a
                  href={`https://tiktok.com/@${business.business_tiktok.replace('@', '')}`}
                  className="flex items-center justify-between rounded-2xl border border-white/40 px-4 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white"
                  target="_blank"
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-2xl bg-white/20 text-white flex items-center justify-center">
                      <i className="ri-tiktok-fill text-lg"></i>
                    </div>
                    <span className="text-sm font-medium">{business.business_tiktok}</span>
                  </div>
                  <i className="ri-arrow-right-up-line text-xs text-white/80"></i>
                </a>
              )}
            </div>
          )}
        </section>

        {/* Content Section */}
        <section id="content" ref={registerSectionRef('content')} className={sectionClasses}>
          <p className="text-xs uppercase tracking-[0.35em] text-pink-500">Content</p>
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Creator Work Showcase</h3>
          <p className="text-gray-600 text-sm mb-6">
            See how other creators have showcased this collaboration
          </p>
          <div className="flex flex-col lg:flex-row lg:flex-wrap gap-3 md:gap-8">
            {(showAllCreatorWork ? creatorWorkExamples : creatorWorkExamples.slice(0, 3)).map((work) => (
              <div
                key={work.id}
                className="group relative overflow-hidden rounded-xl bg-gray-100 cursor-pointer hover:shadow-lg transition-all duration-300 w-full sm:w-auto"
              >
                {/* Post Image */}
                <div className="w-full aspect-square relative h-32 lg:h-48">
                  <img
                    src={work.postImage}
                    alt={`${work.creatorName}'s work`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=400&fit=crop&auto=format`;
                    }}
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <img
                          src={work.profileImage}
                          alt={work.creatorName}
                          className="w-6 h-6 rounded-full object-cover border-2 border-white"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(work.creatorName)}&background=random&size=100`;
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs font-semibold truncate">
                            {work.creatorName}
                          </p>
                          <p className="text-white/80 text-xs truncate">
                            {work.username}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <i className="ri-heart-fill text-white text-sm"></i>
                          <span className="text-white text-xs font-medium">
                            {work.likes}
                          </span>
                        </div>
                        <span className="text-white/90 text-xs bg-purple-500/80 px-2 py-0.5 rounded-full">
                          {work.engagement}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Creator info (visible by default) */}
                <div className="p-2 sm:p-3 bg-white">
                  <div className="flex items-center space-x-2">
                    <img
                      src={work.profileImage}
                      alt={work.creatorName}
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(work.creatorName)}&background=random&size=100`;
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 text-xs font-semibold truncate">
                        {work.creatorName}
                      </p>
                      <p className="text-gray-500 text-xs truncate">
                        {work.username}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-400">
                      <i className="ri-heart-line text-xs"></i>
                      <span className="text-xs">{work.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {creatorWorkExamples.length > 4 && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowAllCreatorWork(!showAllCreatorWork)}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 mx-auto"
              >
                <span>{showAllCreatorWork ? 'Show Less' : `Show More (${creatorWorkExamples.length - 4} more)`}</span>
                <i className={`ri-arrow-${showAllCreatorWork ? 'up' : 'down'}-s-line text-lg`}></i>
              </button>
            </div>
          )}
        </section>

        {/* Offers Section */}
        <section id="offers" ref={registerSectionRef('offers')} className={sectionClasses}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-pink-500">Offers</p>
              <h3 className="text-xl font-semibold text-slate-900">{offerDetails.title}</h3>
            </div>
          </div>

          {/* What You'll Get */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">What You'll Get</h4>
            <p className="text-gray-600 leading-relaxed text-sm">
              {offerDetails.description}
            </p>
          </div>

          {/* Requirements */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Requirements</h4>
            <div className="space-y-2">
              {requirements.length > 0 ? (
                requirements.map((req: string, index: number) => (
                  <div key={index} className="flex items-center space-x-3">
                    <i className="ri-check-line text-green-500"></i>
                    <span className="text-gray-600 text-sm">{req}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No specific requirements listed</p>
              )}
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        {images.length > 0 && (
          <section id="gallery" ref={registerSectionRef('gallery')} className={sectionClasses}>
            <p className="text-xs uppercase tracking-[0.35em] text-pink-500">Gallery</p>
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Visual Showcase</h3>
            <div className="grid grid-cols-2 gap-3">
              {images.slice(0, 4).map((src: string, idx: number) => (
                <div key={idx} className="relative overflow-hidden rounded-2xl ring-1 ring-black/5">
                  <img
                    src={src || offerDetails.main_image || 'https://picsum.photos/400/400'}
                    className="w-full h-32 sm:h-36 object-cover"
                    alt={`Gallery item ${idx + 1}`}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://picsum.photos/seed/gallery-${idx + 1}/400/400`;
                    }}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Location Section */}
        <section id="location" ref={registerSectionRef('location')} className={sectionClasses}>
          <p className="text-xs uppercase tracking-[0.35em] text-pink-500">Location</p>
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Find Us on Maps</h3>
          <div className="rounded-2xl overflow-hidden ring-1 ring-black/5">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.184133894887!2d-73.98811768459387!3d40.74844097932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
              width="100%"
              height="240"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div className="mt-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">{offerDetails.location}</p>
            <p>Easy access via public transport • Parking available</p>
          </div>
        </section>

        {/* Timing Section */}
        <section id="timing" ref={registerSectionRef('timing')} className={sectionClasses}>
          <p className="text-xs uppercase tracking-[0.35em] text-pink-500">Timing</p>
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Weekly Schedule</h3>
          <div className="divide-y divide-slate-100">
            {weeklyTimings.map((slot) => (
              <div key={slot.day} className="flex items-center justify-between py-3">
                <span className="text-sm font-medium text-slate-700">{slot.day}</span>
                <span className="text-sm text-slate-500">{slot.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Establishment Section */}
        <section id="establishment" ref={registerSectionRef('establishment')} className={sectionClasses}>
          <p className="text-xs uppercase tracking-[0.35em] text-pink-500">Establishment</p>
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Other Locations</h3>
          <div className="space-y-3">
            {establishments.map((loc) => (
              <div key={loc.id} className="p-4 rounded-2xl border border-white/60 bg-gradient-to-r from-white to-pink-50">
                <h4 className="text-sm font-semibold text-gray-900">{loc.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{loc.address}</p>
                <p className="text-xs text-gray-500 mt-1">Call: {loc.contact}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews Section - placeholder, can be wired to Supabase reviews table later */}
        {/* <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <h4 className="font-semibold text-gray-800 mb-4">Recent Reviews</h4>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border-b border-gray-100 pb-4 last:border-b-0"
              >
                <div className="flex items-start space-x-3">
                  <img
                    src={review.profileImage}
                    alt={review.influencerName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-800">
                        {review.influencerName}
                      </span>
                      <span className="text-purple-600 text-sm">
                        {review.username}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 mb-2">
                      {[...Array(review.rating)].map((_, i) => (
                        <i
                          key={i}
                          className="ri-star-fill text-yellow-400 text-sm"
                        ></i>
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div> */}


        {(bookingStatus === "accepted" || collaboration) && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 mt-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-semibold text-gray-800">Content Delivery Hub</h4>
                <p className="text-sm text-gray-500">
                  Upload the final video and share your tagged social post for the business.
                </p>
              </div>
              <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                Required
              </span>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Upload collaboration video
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoSelection}
                className="w-full border-2 border-dashed border-purple-200 rounded-2xl p-4 text-sm text-gray-600 cursor-pointer hover:border-purple-400 transition"
              />
              {videoUploadStatus === "uploading" && (
                <p className="text-xs text-gray-500 mt-2">Processing video…</p>
              )}

              {videoPreviewUrl && (
                <div className="mt-4 bg-gray-50 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {videoFileName || "collaboration-video.mp4"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Ready for businesses to download
                      </p>
                    </div>
                    <a
                      href={videoPreviewUrl}
                      download={videoFileName || "collaboration-video.mp4"}
                      className="text-xs font-semibold text-purple-600 hover:text-purple-700"
                    >
                      Download video
                    </a>
                  </div>
                  <video
                    src={videoPreviewUrl}
                    controls
                    className="w-full rounded-xl border border-gray-200"
                  />
                </div>
              )}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Social media post URL
              </label>
              <input
                type="url"
                value={socialLink}
                onChange={(e) => setSocialLink(e.target.value)}
                placeholder="https://instagram.com/p/..."
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                The post must tag @{(business.business_name || offerDetails.business_name || '').replace(/\s+/g, "").toLowerCase()} and include "Collaboration requested via Inshaar."
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <label
                className={`flex items-start space-x-3 rounded-2xl border-2 p-3 cursor-pointer transition ${
                  hasTaggedBusiness ? "border-green-500 bg-green-50" : "border-gray-200"
                }`}
              >
                <input
                  type="checkbox"
                  checked={hasTaggedBusiness}
                  onChange={(event) => setHasTaggedBusiness(event.target.checked)}
                  className="mt-1 w-4 h-4 accent-green-500"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    I tagged the business account in my post
                  </p>
                  <p className="text-xs text-gray-500">
                    Include both @handle and #InshaarCollab in the caption.
                  </p>
                </div>
              </label>
              <label
                className={`flex items-start space-x-3 rounded-2xl border-2 p-3 cursor-pointer transition ${
                  hasSentCollabRequest ? "border-green-500 bg-green-50" : "border-gray-200"
                }`}
              >
                <input
                  type="checkbox"
                  checked={hasSentCollabRequest}
                  onChange={(event) => setHasSentCollabRequest(event.target.checked)}
                  className="mt-1 w-4 h-4 accent-green-500"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    I sent the collaboration request on social media
                  </p>
                  <p className="text-xs text-gray-500">
                    Use Instagram’s “Invite collaborator” or equivalent platform feature.
                  </p>
                </div>
              </label>
            </div>

            <button
              onClick={handleProofSubmission}
              className="w-full mt-6 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Submit content proof
            </button>

            {proofSaved && (
              <p className="text-sm text-green-600 mt-3">
                Submission saved! The business can now download your video and verify the tagged post.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Apply Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6">
        {bookingStatus === null ? (
          <button
            onClick={() => setShowBookingModal(true)}
            className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Book Service
          </button>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="flex items-center space-x-3">
            <div
              className={`w-3 h-3 rounded-full ${
                bookingStatus === "pending"
                  ? "bg-yellow-500"
                  : bookingStatus === "accepted"
                  ? "bg-green-500"
                  : bookingStatus === "cancelled"
                  ? "bg-gray-400"
                  : "bg-red-500"
              }`}
            ></div>
            <span
              className={`font-semibold ${
                bookingStatus === "pending"
                  ? "text-yellow-600"
                  : bookingStatus === "accepted"
                  ? "text-green-600"
                  : bookingStatus === "cancelled"
                  ? "text-gray-600"
                  : "text-red-600"
              }`}
            >
              {bookingStatus === "pending"
                ? "Booking Pending..."
                : bookingStatus === "accepted"
                ? "Booking Confirmed!"
                : bookingStatus === "cancelled"
                ? "Request Cancelled after another acceptance"
                : "Booking Declined"}
            </span>
            </div>
            {bookingStatus === "cancelled" && (
              <button
                onClick={resetCurrentRequest}
                className="text-xs font-semibold text-purple-600 underline underline-offset-4"
              >
                Send a new request
              </button>
            )}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Book Service</h3>
              <button
                onClick={() => {
                  setShowBookingModal(false);
                  setSelectedPeople(0);
                  setSelectedMonth("");
                  setSelectedDate("");
                  setSelectedTime("");
                }}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <i className="ri-close-line text-gray-600"></i>
              </button>
            </div>

            <div className="space-y-6">
              {/* Service Details */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 mb-2">
                  {offerDetails.title}
                </h4>
                <p className="text-gray-600 text-sm">
                  {offerDetails.businessName}
                </p>
              </div>

              {/* People Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Number of People
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      onClick={() => setSelectedPeople(num)}
                      className={`p-3 rounded-lg border-2 text-center transition-all duration-200 ${
                        selectedPeople === num
                          ? "border-purple-500 bg-purple-50 text-purple-700"
                          : "border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                      }`}
                    >
                      <div className="font-semibold text-lg">{num}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Month Selection - Only show if people is selected */}
              {selectedPeople > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Select Month
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {availableMonths.map((month) => (
                    <button
                      key={month.value}
                      onClick={() => {
                        setSelectedMonth(month.value);
                        setSelectedDate(""); // Reset date when month changes
                      }}
                      className={`p-3 rounded-lg border-2 text-center transition-all duration-200 ${
                        selectedMonth === month.value
                          ? "border-purple-500 bg-purple-50 text-purple-700"
                          : "border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                      }`}
                    >
                      <div className="font-semibold">{month.label}</div>
                    </button>
                  ))}
                </div>
              </div>
              )}

              {/* Date Selection - Only show if month is selected */}
              {selectedMonth && (
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Select Date
                  </label>
                  <div className="grid grid-cols-7 gap-2 max-h-48 overflow-y-auto">
                    {availableDates.map((date) => {
                      const dateObj = new Date(date);
                      const dayName = dateObj.toLocaleDateString("en-US", {
                        weekday: "short",
                      });
                      const dayNumber = dateObj.getDate();

                      return (
                        <button
                          key={date}
                          onClick={() => setSelectedDate(date)}
                          className={`p-3 rounded-lg border-2 text-center transition-all duration-200 ${
                            selectedDate === date
                              ? "border-purple-500 bg-purple-50 text-purple-700"
                              : "border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                          }`}
                        >
                          <div className="text-xs text-gray-500 mb-1">{dayName}</div>
                          <div className="font-semibold text-lg">{dayNumber}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Time Selection - Only show if date is selected */}
              {selectedDate && (
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Select Time
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-3 rounded-lg border-2 text-center transition-all duration-200 ${
                          selectedTime === time
                            ? "border-pink-500 bg-pink-50 text-pink-700"
                            : "border-gray-200 hover:border-pink-300 hover:bg-pink-50"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Details */}
              {selectedDate && selectedTime && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Booking Summary
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-gray-600">Number of People:</span>{" "}
                      {selectedPeople}
                    </p>
                    <p>
                      <span className="text-gray-600">Date:</span>{" "}
                      {new Date(selectedDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p>
                      <span className="text-gray-600">Time:</span>{" "}
                      {selectedTime}
                    </p>
                    <p>
                      <span className="text-gray-600">Service:</span>{" "}
                      {offerDetails.title}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowBookingModal(false);
                    setSelectedPeople(0);
                    setSelectedMonth("");
                    setSelectedDate("");
                    setSelectedTime("");
                  }}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBookingSubmit}
                  disabled={!selectedPeople || !selectedDate || !selectedTime}
                  className="flex-1 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Collaboration Agreement</h3>
              <button
                onClick={() => {
                  setShowConfirmationModal(false);
                  setShowBookingModal(true);
                }}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <i className="ri-close-line text-gray-600"></i>
              </button>
            </div>

            <div className="mb-4">
              <p className="text-gray-600 text-sm mb-4">
                Please read the information below before continuing
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 mb-6">
              <h4 className="text-xl font-bold text-gray-800 mb-4">
                Collaboration Terms & Conditions
              </h4>
              <p className="text-gray-600 text-sm mb-6">
                Please read and accept the following terms before proceeding with your collaboration:
              </p>

              <div className="space-y-4 mb-6">
                {/* Condition 1 */}
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => setAcceptedConditions(prev => ({ ...prev, checkDeal: !prev.checkDeal }))}
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                      acceptedConditions.checkDeal
                        ? 'bg-purple-500 border-purple-500'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {acceptedConditions.checkDeal && (
                      <i className="ri-check-line text-white text-sm"></i>
                    )}
                  </button>
                  <div className="flex items-start space-x-2 flex-1">
                    <i className="ri-file-text-line text-yellow-500 text-xl mt-0.5"></i>
                    <p className="text-gray-800 text-sm">
                      I have reviewed and understand the collaboration terms and requirements
                    </p>
                  </div>
                </div>

                {/* Condition 2 */}
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => setAcceptedConditions(prev => ({ ...prev, respectDateTime: !prev.respectDateTime }))}
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                      acceptedConditions.respectDateTime
                        ? 'bg-purple-500 border-purple-500'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {acceptedConditions.respectDateTime && (
                      <i className="ri-check-line text-white text-sm"></i>
                    )}
                  </button>
                  <div className="flex items-start space-x-2 flex-1">
                    <i className="ri-time-line text-red-500 text-xl mt-0.5"></i>
                    <p className="text-gray-800 text-sm">
                      I will respect the scheduled date and time for this collaboration
                    </p>
                  </div>
                </div>

                {/* Condition 3 */}
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => setAcceptedConditions(prev => ({ ...prev, postContent: !prev.postContent }))}
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                      acceptedConditions.postContent
                        ? 'bg-purple-500 border-purple-500'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {acceptedConditions.postContent && (
                      <i className="ri-check-line text-white text-sm"></i>
                    )}
                  </button>
                  <div className="flex items-start space-x-2 flex-1">
                    <i className="ri-smartphone-line text-gray-800 text-xl mt-0.5"></i>
                    <p className="text-gray-800 text-sm">
                      I will post the required content within 48 hours of the collaboration
                    </p>
                  </div>
                </div>
              </div>

              {/* Collaboration Summary */}
              {selectedDate && selectedTime && (
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <h5 className="font-semibold text-gray-800 mb-2 text-sm">Collaboration Summary</h5>
                  <div className="space-y-1 text-xs text-gray-600">
                    <p>
                      <span className="font-medium">Number of People:</span> {selectedPeople}
                    </p>
                    <p>
                      <span className="font-medium">Date:</span>{" "}
                      {new Date(selectedDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p>
                      <span className="font-medium">Time:</span> {selectedTime}
                    </p>
                    <p>
                      <span className="font-medium">Business:</span> {offerDetails.businessName}
                    </p>
                    <p>
                      <span className="font-medium">Offer:</span> {offerDetails.title}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowConfirmationModal(false);
                    setShowBookingModal(true);
                  }}
                  className="w-full py-3 px-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmBooking}
                  disabled={!acceptedConditions.checkDeal || !acceptedConditions.respectDateTime || !acceptedConditions.postContent}
                  className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Accept & Continue
                </button>
              </div>

              {/* Disclaimer */}
              <p className="text-xs text-gray-500 mt-4 text-center">
                *Failure to comply with these terms may result in the revocation of your access to the Inshaar app
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm">
            <div className="text-center mb-6">
              <i className="ri-check-double-line text-6xl text-green-500 mb-4"></i>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Application Sent!
              </h3>
              <p className="text-gray-600">
                We'll notify you when the business responds
              </p>
            </div>

            <button
              onClick={() => setShowApplyModal(false)}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-semibold"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      )}

      {/* Notification */}
      {showNotificationComponent()}
    </div>
  );
}
