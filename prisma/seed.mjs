import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Plain JavaScript on purpose: runs with `node` alone (no tsx/esbuild, which needs macOS 12+).
const DEMO_PASSWORD = "Demo@2026"; // keep in sync with lib/demo.ts

async function nextValue(tx, id) {
  const c = await tx.counter.upsert({ where: { id }, update: { value: { increment: 1 } }, create: { id, value: 1 } });
  return c.value;
}
async function nextMatricNo(tx) {
  const year = new Date().getFullYear();
  return `MUI/${year}/${String(await nextValue(tx, `matric-${year}`)).padStart(4, "0")}`;
}
async function nextMemberNo(tx, code) {
  const year = new Date().getFullYear();
  return `MUI/${code}/${year}/${String(await nextValue(tx, `member-${code}-${year}`)).padStart(4, "0")}`;
}
async function nextDonationReceiptNo(tx) {
  const year = new Date().getFullYear();
  return `MUI-DON-${year}-${String(await nextValue(tx, `donation-${year}`)).padStart(6, "0")}`;
}
async function nextReceiptNo(tx) {
  const year = new Date().getFullYear();
  return `MUI-RCP-${year}-${String(await nextValue(tx, `receipt-${year}`)).padStart(6, "0")}`;
}

const prisma = new PrismaClient();
const SESSION = "2026/2027";
const naira = (n) => n * 100; // to kobo

const programmes = [
  {
    slug: "tahfeez",
    title: "Tahfeez-ul-Qur'an",
    arabicTitle: "تحفيظ القرآن الكريم",
    summary:
      "Complete memorisation of the Noble Qur'an under certified huffadh, with daily revision (muraja'ah), tajweed correction and a final ijazah recitation.",
    duration: "3 – 4 years",
    mode: "Full-time, on campus",
    schedule: "Sat – Thu, 7:00am – 1:00pm",
    order: 1,
    tuition: 120000,
  },
  {
    slug: "arabic-language",
    title: "Arabic Language",
    arabicTitle: "اللغة العربية",
    summary:
      "From the alphabet to classical texts: nahw, sarf, balaghah, reading and composition — taught through the Madinah curriculum with spoken practice.",
    duration: "2 years (4 levels)",
    mode: "Full-time or weekend",
    schedule: "Mon – Fri, 9:00am – 2:00pm",
    order: 2,
    tuition: 85000,
  },
  {
    slug: "islamic-studies-diploma",
    title: "Diploma in Islamic Studies",
    arabicTitle: "الدبلوم في الدراسات الإسلامية",
    summary:
      "A structured diploma covering 'aqidah, fiqh, hadith, seerah, tafsir and Islamic history, preparing graduates to teach and serve their communities.",
    duration: "2 years",
    mode: "Full-time",
    schedule: "Mon – Fri, 8:00am – 3:00pm",
    order: 3,
    tuition: 150000,
  },
  {
    slug: "tajweed-qiraat",
    title: "Tajweed & Qira'at",
    arabicTitle: "التجويد والقراءات",
    summary:
      "Precise articulation, rules of recitation and the major qira'at, culminating in a sanad-connected ijazah for qualified students.",
    duration: "1 year",
    mode: "Evenings & weekends",
    schedule: "Tue, Thu & Sat, 4:00pm – 6:30pm",
    order: 4,
    tuition: 60000,
  },
  {
    slug: "childrens-madrasah",
    title: "Children's Madrasah",
    arabicTitle: "مدرسة الأطفال",
    summary:
      "A warm, structured foundation for ages 5 – 12: Qur'an reading, du'a, adab, basic fiqh of worship and Arabic — taught with patience and play.",
    duration: "Continuous (termly)",
    mode: "Weekends",
    schedule: "Sat & Sun, 9:00am – 1:00pm",
    order: 5,
    tuition: 45000,
  },
  {
    slug: "adult-evening",
    title: "Adult Evening Classes",
    arabicTitle: "فصول الكبار المسائية",
    summary:
      "For working professionals: Qur'an reading, essential fiqh and Arabic in small groups, scheduled around the working day.",
    duration: "1 year",
    mode: "Evenings",
    schedule: "Mon, Wed & Fri, 6:00pm – 8:00pm",
    order: 6,
    tuition: 40000,
  },
];

async function main() {
  for (const p of programmes) {
    const { tuition, ...data } = p;
    const prog = await prisma.programme.upsert({ where: { slug: p.slug }, update: data, create: data });
    const exists = await prisma.feeItem.findFirst({ where: { programmeId: prog.id, session: SESSION } });
    if (!exists) {
      await prisma.feeItem.create({
        data: {
          name: `Tuition — ${p.title}`,
          description: `Full session tuition for ${p.title}`,
          amount: naira(tuition),
          session: SESSION,
          programmeId: prog.id,
        },
      });
    }
  }

  const general = [
    { name: "Application Fee", description: "Processing of admission application", amount: naira(5000) },
    { name: "Acceptance Fee", description: "Secures your admission and activates your student account", amount: naira(15000), activatesAccount: true },
    { name: "ID Card Fee", description: "Production of your official student identity card", amount: naira(3000) },
  ];
  for (const g of general) {
    const exists = await prisma.feeItem.findFirst({ where: { name: g.name, session: SESSION, programmeId: null } });
    if (!exists) await prisma.feeItem.create({ data: { ...g, session: SESSION } });
  }

  // Congregation membership dues (charged to members, not students)
  const YEAR = String(new Date().getFullYear());
  const memberFees = [
    { name: "Annual Membership Dues", description: "Yearly dues — activates your membership", amount: naira(5000), activatesAccount: true },
    { name: "Membership ID Card", description: "Production of your membership identity card", amount: naira(2000) },
  ];
  for (const m of memberFees) {
    const exists = await prisma.feeItem.findFirst({ where: { name: m.name, audience: "MEMBER", session: YEAR } });
    if (!exists) await prisma.feeItem.create({ data: { ...m, session: YEAR, audience: "MEMBER" } });
  }

  // Donation causes
  const causes = [
    { slug: "general-fund", title: "General Fund", arabicTitle: "الصندوق العام", summary: "Where it is needed most — teachers' welfare, utilities, learning materials and day-to-day running of the Markaz.", goal: null, order: 1 },
    { slug: "sponsor-a-student", title: "Sponsor a Student", arabicTitle: "كفالة طالب", summary: "Cover a full session's tuition for a sincere student who cannot afford the fees. ₦120,000 sponsors one hafiz-in-training for a year.", goal: naira(2400000), order: 2 },
    { slug: "masjid-maintenance", title: "Masjid Maintenance & Expansion", arabicTitle: "عمارة المسجد", summary: "Roofing, ablution areas, carpets, fans and lighting so the jama'ah can worship in comfort — a lasting sadaqah jariyah.", goal: naira(5000000), order: 3 },
    { slug: "ramadan-feeding", title: "Ramadan Iftar & Feeding", arabicTitle: "إفطار صائم", summary: "Provide iftar for fasting students, neighbours and travellers throughout Ramadan.", goal: naira(1500000), order: 4 },
    { slug: "quran-copies", title: "Mushaf & Books", arabicTitle: "وقف المصاحف", summary: "Place copies of the Qur'an and Arabic textbooks in students' hands — rewarded every time they are read.", goal: naira(800000), order: 5 },
  ];
  for (const c of causes) {
    await prisma.donationCause.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }

  if ((await prisma.announcement.count()) === 0) {
    await prisma.announcement.createMany({
      data: [
        {
          title: `Admissions open for the ${SESSION} session`,
          body: "Applications are now open for all programmes. Register online, pay the acceptance fee and your account is activated immediately.",
          pinned: true,
        },
        {
          title: "Orientation & Opening Du'a",
          body: "All newly admitted students and their guardians are invited to the orientation and opening du'a in the main hall. Kindly arrive 30 minutes early.",
        },
      ],
    });
  }

  const email = (process.env.ADMIN_EMAIL || "admin@markazuligathah.org").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "ChangeMe!2026";
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash: await bcrypt.hash(password, 12),
      role: "ADMIN",
      firstName: "Registry",
      lastName: "Admin",
      phone: "0000000000",
      gender: "MALE",
      status: "ACTIVE",
    },
  });

  console.log(`Seeded programmes, fees, announcements and admin (${email}).`);

  if (process.env.DEMO_MODE === "true") {
    await seedDemo();
    console.log(`Seeded demo accounts — password for all: ${DEMO_PASSWORD}`);
  }
}

/** A simple illustrated passport placeholder so the demo ID card renders. */
function avatar(initials, bg) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 360"><rect width="300" height="360" fill="${bg}"/><circle cx="150" cy="140" r="62" fill="#F3E7CC"/><path d="M40 360c8-80 56-120 110-120s102 40 110 120Z" fill="#4A2C1A"/><text x="150" y="330" font-family="Georgia,serif" font-size="34" fill="#E6CF8F" text-anchor="middle">${initials}</text></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

async function seedDemo() {
  const hash = await bcrypt.hash(DEMO_PASSWORD, 12);
  const prog = async (slug) => (await prisma.programme.findUniqueOrThrow({ where: { slug } })).id;

  // Admin
  await prisma.user.upsert({
    where: { email: "demo.admin@markazuligathah.org" },
    update: {},
    create: { email: "demo.admin@markazuligathah.org", passwordHash: hash, role: "ADMIN", firstName: "Demo", lastName: "Registrar", phone: "08000000000", gender: "MALE", status: "ACTIVE" },
  });

  const students = [
    {
      email: "student@markazuligathah.org", firstName: "Abdullahi", lastName: "Yusuf", arabicName: "عبد الله يوسف", gender: "MALE",
      slug: "tahfeez", status: "ACTIVE", photoBg: "#E9DFC8", pay: ["Application Fee", "Acceptance Fee", "ID Card Fee"],
    },
    { email: "applicant@markazuligathah.org", firstName: "Maryam", lastName: "Bello", gender: "FEMALE", slug: "arabic-language", status: "PENDING" },
    {
      email: "alumni@markazuligathah.org", firstName: "Hafsah", lastName: "Lawal", arabicName: "حفصة لاوال", gender: "FEMALE",
      slug: "islamic-studies-diploma", status: "GRADUATED", entryType: "ALUMNUS", photoBg: "#D8CAA8",
      alumni: { graduationYear: 2023, occupation: "Islamic Studies Teacher", location: "Ilorin, Nigeria", bio: "Graduated with the Diploma in Islamic Studies and now teach fiqh and seerah at a secondary school. Happy to mentor sisters joining the Diploma programme." },
    },
    {
      email: "yahya.demo@markazuligathah.org", firstName: "Yahya", lastName: "Abubakar", gender: "MALE", slug: "tahfeez", status: "GRADUATED", photoBg: "#E6CF8F",
      alumni: { graduationYear: 2022, occupation: "Imam & Qur'an Teacher", location: "Kano, Nigeria", bio: "Completed hifz in 2022 with ijazah in the riwayah of Hafs. Leading Tarawih and running a weekend tahfeez class." },
    },
    {
      email: "zainab.demo@markazuligathah.org", firstName: "Zainab", lastName: "Oladipo", gender: "FEMALE", slug: "arabic-language", status: "GRADUATED", photoBg: "#E9DFC8",
      alumni: { graduationYear: 2024, occupation: "Translator (Arabic–English)", location: "Lagos, Nigeria", bio: "The Arabic programme opened the classical texts to me. I now translate Islamic books and help students with Arabic composition." },
    },
  ];

  for (const s of students) {
    const programmeId = await prog(s.slug);
    const existing = await prisma.user.findUnique({ where: { email: s.email } });
    const user =
      existing ??
      (await prisma.$transaction(async (tx) =>
        tx.user.create({
          data: {
            email: s.email, passwordHash: hash, firstName: s.firstName, lastName: s.lastName, arabicName: s.arabicName ?? null,
            gender: s.gender, phone: "08012345678", programmeId, status: s.status, entryType: s.entryType ?? "NEW_STUDENT",
            session: SESSION, matricNo: await nextMatricNo(tx), address: "Ilorin, Kwara State", stateOfOrigin: "Kwara",
            guardianName: "Demo Guardian", guardianPhone: "08098765432",
            photo: s.photoBg ? avatar(`${s.firstName[0]}${s.lastName[0]}`, s.photoBg) : null,
          },
        }),
      ));

    if (s.pay && (await prisma.payment.count({ where: { userId: user.id } })) === 0) {
      for (const name of s.pay) {
        const fee = await prisma.feeItem.findFirstOrThrow({ where: { name, session: SESSION, programmeId: null } });
        await prisma.$transaction(async (tx) =>
          tx.payment.create({
            data: {
              userId: user.id, feeItemId: fee.id, purpose: fee.name, amount: fee.amount, status: "SUCCESS", channel: "demo",
              reference: `DEMO-${user.id.slice(-6)}-${fee.id.slice(-6)}`.toUpperCase(), receiptNo: await nextReceiptNo(tx), paidAt: new Date(),
            },
          }),
        );
      }
    }

    if (s.alumni) {
      await prisma.alumniProfile.upsert({ where: { userId: user.id }, update: {}, create: { ...s.alumni, userId: user.id } });
    }
  }

  // Congregation members — one per segment (codes match lib/segments.ts)
  const YEAR = String(new Date().getFullYear());
  const members = [
    { email: "member@markazuligathah.org", firstName: "Abdulrahman", lastName: "Salihu", arabicName: "عبد الرحمن صالح", gender: "MALE", segment: "IBADUR_RAHMAN", code: "IBR", status: "ACTIVE", photoBg: "#E9DFC8", pay: ["Annual Membership Dues"] },
    { email: "elder.demo@markazuligathah.org", firstName: "Alhaji Musa", lastName: "Adebayo", gender: "MALE", segment: "ELDER", code: "ELD", status: "ACTIVE", photoBg: "#E6CF8F" },
    { email: "zeenat.demo@markazuligathah.org", firstName: "Aminat", lastName: "Olawale", gender: "FEMALE", segment: "ZEENATUL_IGATHAH", code: "ZEN", status: "ACTIVE", photoBg: "#D8CAA8" },
    { email: "fatayaat.demo@markazuligathah.org", firstName: "Rukayyah", lastName: "Ibrahim", gender: "FEMALE", segment: "FATAYAATUL_IGATHAH", code: "FAT", status: "PENDING" },
    { email: "general.demo@markazuligathah.org", firstName: "Sulaiman", lastName: "Bakare", gender: "MALE", segment: "MEMBER", code: "MEM", status: "PENDING" },
  ];
  for (const m of members) {
    const existing = await prisma.user.findUnique({ where: { email: m.email } });
    const user =
      existing ??
      (await prisma.$transaction(async (tx) =>
        tx.user.create({
          data: {
            role: "MEMBER", email: m.email, passwordHash: hash, firstName: m.firstName, lastName: m.lastName, arabicName: m.arabicName ?? null,
            gender: m.gender, phone: "08023456789", segment: m.segment, status: m.status, session: YEAR,
            matricNo: await nextMemberNo(tx, m.code), occupation: "Trader", address: "Ilorin, Kwara State",
            photo: m.photoBg ? avatar(`${m.firstName[0]}${m.lastName[0]}`, m.photoBg) : null,
          },
        }),
      ));
    if (m.pay && (await prisma.payment.count({ where: { userId: user.id } })) === 0) {
      for (const name of m.pay) {
        const fee = await prisma.feeItem.findFirstOrThrow({ where: { name, audience: "MEMBER" } });
        await prisma.$transaction(async (tx) =>
          tx.payment.create({
            data: {
              userId: user.id, feeItemId: fee.id, purpose: fee.name, amount: fee.amount, status: "SUCCESS", channel: "demo",
              reference: `DEMO-${user.id.slice(-6)}-${fee.id.slice(-6)}`.toUpperCase(), receiptNo: await nextReceiptNo(tx), paidAt: new Date(),
            },
          }),
        );
      }
    }
  }

  // Sample donations so the donate page and admin reports aren't empty
  if ((await prisma.donation.count()) === 0) {
    const bySlug = async (slug) => (await prisma.donationCause.findUnique({ where: { slug } }))?.id ?? null;
    const gifts = [
      { donorName: "Ibrahim Yusuf", email: "ibrahim@example.com", amount: 50000, slug: "sponsor-a-student", message: "For a hafiz who needs it. Please make du'a for my parents." },
      { donorName: "Hajia Khadijah Bello", email: "khadijah@example.com", amount: 250000, slug: "masjid-maintenance" },
      { donorName: "Anonymous", email: "anon@example.com", amount: 100000, slug: "sponsor-a-student", anonymous: true },
      { donorName: "Usman Adeyemi", email: "usman@example.com", amount: 10000, slug: "general-fund", message: "Barakallahu feekum." },
      { donorName: "Maryam Sanni", email: "maryam@example.com", amount: 25000, slug: "quran-copies" },
      { donorName: "Abdullahi Yusuf", email: "student@markazuligathah.org", amount: 5000, slug: "ramadan-feeding" },
    ];
    for (const [i, g] of gifts.entries()) {
      const causeId = await bySlug(g.slug);
      await prisma.$transaction(async (tx) =>
        tx.donation.create({
          data: {
            donorName: g.donorName, email: g.email, amount: naira(g.amount), causeId, message: g.message ?? null, anonymous: !!g.anonymous,
            reference: `DON-DEMO-${String(i + 1).padStart(4, "0")}`, status: "SUCCESS", channel: "demo",
            receiptNo: await nextDonationReceiptNo(tx), paidAt: new Date(Date.now() - i * 36e5 * 20),
          },
        }),
      );
    }
  }

  if ((await prisma.contactMessage.count()) === 0) {
    await prisma.contactMessage.create({
      data: { name: "Umar Ibrahim", email: "umar@example.com", phone: "08011112222", subject: "Weekend class for my son", message: "Assalamu alaykum. Is there still space in the Children's Madrasah for a 7-year-old this term? Jazakumullahu khairan." },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
