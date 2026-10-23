/**
 * Congregation segments. Edit labels, Arabic names, descriptions and colours here —
 * every page, ID card and admin screen reads from this one list.
 * TODO: confirm each segment's description and eligibility with the Markaz.
 */
export const SEGMENTS = {
  ELDER: {
    label: "Elders",
    arabic: "الشيوخ",
    code: "ELD",
    color: "#7A5A1F",
    blurb: "The senior members of the jama'ah whose counsel, experience and du'a guide the affairs of the Markaz.",
  },
  IBADUR_RAHMAN: {
    label: "Ibadur Rahman",
    arabic: "عباد الرحمن",
    code: "IBR",
    color: "#0F4C3A",
    blurb: "“The servants of the Most Merciful” — the brothers' wing, active in da'wah, service and the life of the masjid.",
  },
  ZEENATUL_IGATHAH: {
    label: "Zeenatul Igathah",
    arabic: "زينة الإغاثة",
    code: "ZEN",
    color: "#6B2A55",
    blurb: "“The adornment of al-Ighathah” — the women's wing, leading sisters' programmes, welfare and community support.",
  },
  FATAYAATUL_IGATHAH: {
    label: "Fatayaatul Igathah",
    arabic: "فتيات الإغاثة",
    code: "FAT",
    color: "#1D5F7A",
    blurb: "The young ladies of the Markaz — learning, mentorship and youth activities for the next generation of sisters.",
  },
  MEMBER: {
    label: "Member",
    arabic: "عضو",
    code: "MEM",
    color: "#1F7A5C",
    blurb: "General members of the congregation who pray with us, support the Markaz and take part in its activities.",
  },
} as const;

export type SegmentKey = keyof typeof SEGMENTS;
export const SEGMENT_KEYS = Object.keys(SEGMENTS) as SegmentKey[];

export function segmentLabel(s: string | null | undefined) {
  return s && s in SEGMENTS ? SEGMENTS[s as SegmentKey].label : "—";
}
