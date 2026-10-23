/**
 * Institution details — edit these to match Markaz-ul-Igathah's real information.
 * Everything marked TODO is a placeholder.
 */
export const site = {
  name: "Markaz-ul-Igathah",
  arabicName: "مركز الإغاثة",
  shortName: "MUI",
  tagline: "A House of Qur'an, Arabic & Islamic Learning",
  description:
    "Markaz-ul-Igathah is an Arabic and Islamic institution nurturing huffadh, scholars and upright citizens through authentic knowledge, sincere character and excellence in service.",
  founded: 2009, // TODO: confirm founding year
  currentSession: "2026/2027",
  address: "No. 15 Markaz Road, Limca Junction, Aparadija, Ado-Odo Ota, Ogun State, Nigeria", // TODO
  phone: "+234 800 000 0000", // TODO
  email: "info@markazuligathah.org", // TODO
  hours: "Sat – Thu · 7:30am – 5:00pm",
  mudir: { name: "Sheikh Qamarudeen Alim Akinola", title: "Mudir (Director)" }, // TODO
  registrar: "Registrar, Markaz-ul-Igathah",
  socials: {
    facebook: "#", // TODO
    instagram: "#",
    youtube: "#",
    whatsapp: "#",
  },
  stats: [
    { value: "1,200+", label: "Students taught" },
    { value: "340", label: "Huffadh graduated" },
    { value: "28", label: "Qualified teachers" },
    { value: "6", label: "Programmes" },
  ],
};

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
