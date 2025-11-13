import {
  Benefit,
  Blog,
  NavItem,
  Service,
  TeamMember,
  Testimonial,
} from "../types/content";

export const navItems: NavItem[] = [
  "Home",
  "About",
  "Services",
  "Blogs & News",
  "Events",
  "FAQ",
  "Contact",
];

export const services: Service[] = [
  {
    title: "Strategic Advisory",
    description:
      "Eliminate inefficiencies, restructure, improve governance and refine your governing bodies.",
  },
  {
    title: "GC Support",
    description:
      "Integrate multidisciplinary growth-oriented legal team and network of our international law firms worldwide to support your GC and legal function.",
  },
  {
    title: "CFO Support",
    description:
      "Integrate our multidisciplinary growth-oriented finance team and network of international finance and tax professionals to support your finance function.",
  },
  {
    title: "Wealth Counsel",
    description:
      "Structure, protect and manage your wealth through private banking and corporate vehicles in Switzerland and UAE.",
  },
];

export const team: TeamMember[] = [
  {
    name: "Aleko Nanadze",
    role: "Co-founder & CEO",
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400",
  },
  // {
  //   name: "Nicola Mariani",
  //   role: "Co-founder",
  //   img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
  // },
  {
    name: "Archil Giorgadze",
    role: "Co-founder",
    img: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400",
  },
  {
    name: "Jeremy Sewell",
    role: "Co-founder",
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
  },
  {
    name: "David Khubua",
    role: "Head of CFO Services",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
  },
  {
    name: "Ana Kochiashvili",
    role: "Senior Counsel",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
  },
  {
    name: "Liza Beruashvili",
    role: "Project Manager",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
  },
];

export const benefits: Benefit[] = [
  { title: "FOCUS", description: "We deal with what you often avoid" },
  {
    title: "GROWTH",
    description: "You are more likely to realize your vision",
  },
  {
    title: "RESILIENCE",
    description: "You are more likely to withstand crisis or emergency",
  },
];

export const testimonials: Testimonial[] = [
  {
    text: "Vault managed to set up Trust structure for my family in the record time of about 1 month, leveraging their extensive network and fast-moving in-house team. Vault has set-up legal function and corporate governance across our portfolio companies which considerably improved speed of transacting, process and reduced our legal fees by at least 40%.",
    author: "Latvian HNWI",
  },
  {
    text: "Vault is covering legal and finance function of our investment firms in 5 jurisdictions and portfolio companies worldwide. With their help we reshaped quality of our board and investment committee. We have completely offloaded the burden of deal execution, corporate governance and investment supervision to Vault's team, as we now fully focus on growth.",
    author: "Swiss PE Firm",
  },
  {
    text: "We are a group of data center infrastructure company with variety of investors, led by large infrastructure fund. We engaged Vault in response to severe inefficiencies in our back office: disorganized financial reporting, weeks to turn on simple documents; and roughly $300,000 in legal and consultant fees in the first 2 months. With Vault we have established an efficient transitional back office and reduced outside fees by 60%",
    author: "UK Infra Group",
  },
];

export const blogs: Blog[] = [
  {
    title: "Global Data Centre Ecosystem – Leadership Discussion Dinner",
    date: "October 17, 2025",
    type: "Event",
    excerpt:
      "On 11 November 2025, Vault joins Spectrum EHCS in co-hosting an exclusive leadership dinner in Mayfair, London – bringing together data centre executives and…",
  },
  {
    title: "Vault x Spectrum: Data Centre Leadership Dinner",
    date: "October 10, 2025",
    type: "Event",
    excerpt:
      "On 11 November 2025, Vault joins Spectrum EHCS in co-hosting an exclusive leadership dinner in Mayfair, London - bringing together data centre executives and investors for high-level discussion under the…",
  },
  {
    title: "Vault Launches Lexminster Brand, with its First Law Firm in Uzbekistan",
    date: "September 23, 2025",
    type: "News",
    excerpt:
      "Vault has launched Lexminster, a newly established brand for full-service law firms. Its first office will be in Tashkent. The investment extends Vault's reach to premium advisory services and enhances…",
  },
];

