"use client";

import Link from "next/link";
import AdvancedBottomNav from "../../../components/AdvancedBottomNav";
import { useState } from "react";
import { useRouter } from "next/navigation";

const tabs = [
  { id: "information", label: "INFORMATIONS" },
  { id: "content", label: "CONTENUS" },
  { id: "establishments", label: "ÉTABLISSEMENTS" },
];

const showcaseItems = [
  {
    id: 1,
    influencer: "@sarahstyles",
    platform: "Instagram Reels",
    type: "video",
    title: "Dining at Bella Vista",
    thumbnail: "https://picsum.photos/seed/showcase-1/800/600",
    views: "24.1K",
    likes: "1.8K",
    date: "2 weeks ago",
  },
  {
    id: 2,
    influencer: "@foodieguy",
    platform: "TikTok",
    type: "video",
    title: "Chef's Special Review",
    thumbnail: "https://picsum.photos/seed/showcase-2/800/600",
    views: "57.3K",
    likes: "3.2K",
    date: "1 month ago",
  },
  {
    id: 3,
    influencer: "@citylife",
    platform: "Instagram",
    type: "image",
    title: "Cozy Corner Spotlight",
    thumbnail: "https://picsum.photos/seed/showcase-3/800/600",
    views: "8.9K",
    likes: "640",
    date: "3 days ago",
  },
];

const establishments = [
  {
    id: 1,
    title: "Bella Vista • Downtown",
    address: "78 Rue du Faubourg, Paris 17",
    hours: "Open • Closes 22:30",
  },
  {
    id: 2,
    title: "Bella Vista • Rive Gauche",
    address: "12 Boulevard Saint-Germain, Paris",
    hours: "Open for lunch & dinner",
  },
];

const brandTags = ["Beauté", "Wellness"];

const highlights = [
  "Lissage brésilien, japonais et français",
  "Soin Botox capillaire revitalisant",
  "Manucure & pédicure pour des ongles impeccables",
];

const socialLinks = [
  {
    id: "website",
    icon: "ri-earth-line",
    label: "https://www.17thbeauty.fr/",
    href: "https://www.17thbeauty.fr/",
  },
  { id: "instagram", icon: "ri-instagram-line", label: "@17th_beauty" },
  { id: "tiktok", icon: "ri-tiktok-fill", label: "@17th_beauty" },
];

const heroImage =
  "https://images.unsplash.com/photo-1523419409543-0c1df022bddb?auto=format&fit=crop&w=1400&q=80";

const statHighlights = [
  { value: "28", label: "Pass collabs" },
  { value: "4.8", label: "Note moyenne" },
  { value: "126K", label: "Vues totales" },
];

const brandStoryParagraphs = [
  "Bienvenue chez 17th beauty (Shay beauty), votre salon de coiffure 100% féminin situé dans le 17ème arrondissement de Paris.",
  "Nous offrons des services capillaires de qualité, incluant le lissage (brésilien, japonais, français), le soin Botox capillaire pour revitaliser vos cheveux, et le soin Tokyo pour une hydratation en profondeur.",
  "En plus de nos prestations capillaires, profitez de nos services de manucure et pédicure pour des ongles impeccables. Notre équipe de professionnelles vous accueille dans un cadre chic et raffiné, dédié à votre beauté et bien-être.",
  "Venez vivre une expérience unique chez 17th beauty. Indiquez votre prestation en amont s'il vous plaît.",
];

export default function BusinessProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("information");

  const renderInformationSection = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        {socialLinks.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3"
          >
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-2xl bg-gray-50 flex items-center justify-center">
                <i className={`${item.icon} text-lg text-gray-800`}></i>
              </div>
              <span className="text-sm font-medium text-gray-800">
                {item.label}
              </span>
            </div>
            {item.href && (
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-purple-600"
              >
                Ouvrir
              </a>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-3xl bg-gray-50 p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          17th Beauty
        </h3>
        <div className="space-y-3 text-sm leading-relaxed text-gray-600">
          {brandStoryParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-gray-100 p-5 bg-white shadow-sm">
        <div className="space-y-3">
          {highlights.map((line) => (
            <div key={line} className="flex items-start space-x-3">
              <i className="ri-check-line text-purple-500 mt-1"></i>
              <p className="text-sm text-gray-800">{line}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContentSection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Dernières collaborations avec nos influenceurs partenaires.
        </p>
        <button className="text-xs font-semibold text-purple-600">
          Gérer
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {showcaseItems.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl overflow-hidden bg-white shadow-sm"
          >
            <div className="relative">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="h-36 w-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <span
                  className={`px-2 py-1 text-[11px] font-semibold rounded-full ${
                    item.platform.includes("Instagram")
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                      : item.platform.includes("TikTok")
                      ? "bg-black text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {item.platform}
                </span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <i className="ri-play-circle-line text-white text-3xl"></i>
              </div>
            </div>
            <div className="p-4 space-y-1">
              <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">
                {item.title}
              </h4>
              <p className="text-xs text-gray-500">{item.influencer}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center space-x-1">
                  <i className="ri-eye-line"></i>
                  <span>{item.views}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <i className="ri-heart-line"></i>
                  <span>{item.likes}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEstablishmentsSection = () => (
    <div className="space-y-4">
      {establishments.map((place) => (
        <div
          key={place.id}
          className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-gray-900">
                {place.title}
              </h4>
              <p className="text-xs text-gray-500">{place.address}</p>
            </div>
            <span className="text-xs font-semibold text-green-600">
              {place.hours}
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <button className="flex items-center space-x-2 text-sm font-semibold text-purple-600">
              <i className="ri-map-pin-line"></i>
              <span>Itinéraire</span>
            </button>
            <button className="w-11 h-11 rounded-2xl bg-gray-50 flex items-center justify-center">
              <i className="ri-more-2-line text-lg text-gray-600"></i>
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="relative h-[360px]">
        <img
          src={heroImage}
          alt="Salon 17th Beauty"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
        <div className="absolute inset-x-0 top-0 px-6 pt-10">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <Link href="/business/dashboard">
                <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur">
                  <i className="ri-arrow-left-line text-xl"></i>
                </div>
              </Link>
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/70">
                  Wellness
                </p>
                <h1 className="text-2xl font-semibold tracking-tight">
                  17TH BEAUTY
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur" >
                <i className="ri-notification-line text-xl"></i>
              </button>
              <button onClick={() => router.push("/settings")} className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur">
                <i className="ri-settings-3-line text-xl"></i>
              </button>
            </div>
          </div>
          <button className="mt-4 inline-flex items-center space-x-2 rounded-full bg-white/20 px-4 py-1 text-xs font-semibold text-white backdrop-blur">
            <span>Changer de marque</span>
            <i className="ri-arrow-down-s-line text-lg"></i>
          </button>
        </div>
        <div className="absolute inset-x-6 -bottom-16">
          <div className="rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src="https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=200&q=80"
                  alt="Brand logo"
                  className="h-20 w-20 rounded-3xl object-cover"
                />
                <div>
                  <p className="text-sm uppercase text-gray-500">Wellness</p>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    17th Beauty
                  </h2>
                  <p className="text-sm text-gray-500">
                    Paris • Membre depuis 2021
                  </p>
                </div>
              </div>
              <span className="flex items-center space-x-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-500">
                <i className="ri-star-s-fill"></i>
                <span>4.8</span>
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {brandTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-gray-200 px-4 py-1 text-xs font-semibold text-gray-600"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {statHighlights.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl bg-gray-50 p-4 text-center"
                >
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                {
                  label: "Éditer ma marque",
                  action: () => router.push("/business/profile/edit"),
                  className:
                    "bg-gradient-to-r from-orange-500 to-red-500 text-white",
                },
                {
                  label: "Gérer mes accès",
                  action: () => router.push("/business/access"),
                  className:
                    "bg-gradient-to-r from-orange-500 to-pink-500 text-white",
                },
                {
                  label: "Voir la facturation",
                  action: () => router.push("/business/billing"),
                  className:
                    "bg-gradient-to-r from-purple-500 to-indigo-500 text-white",
                },
              ].map((cta) => (
                <button
                  key={cta.label}
                  onClick={cta.action}
                  className={`w-full rounded-2xl px-4 py-4 text-sm font-semibold shadow-md transition ${cta.className}`}
                >
                  {cta.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-28 px-6 space-y-6">
        <div className="rounded-3xl bg-white p-1 shadow-sm flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 rounded-3xl py-3 text-xs font-semibold tracking-wide transition ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow"
                  : "text-gray-500"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
          {activeTab === "information" && renderInformationSection()}
          {activeTab === "content" && renderContentSection()}
          {activeTab === "establishments" && renderEstablishmentsSection()}
        </div>
      </div>

      <AdvancedBottomNav userType="business" />
    </div>
  );
}
