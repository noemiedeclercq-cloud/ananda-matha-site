import type { HomePage, NavigationItem, PageContent, SiteSettings } from "./types";

const monasteryImage = "/images/monastery-hero.svg";
const gardenImage = "/images/garden-work.svg";
const prayerImage = "/images/prayer-hills.svg";

export const fallbackSettings: SiteSettings = {
  siteTitle: "Ananda Matha Monastery",
  subtitle: "A Cistercian Monastery in the Wayanad District of Kerala, India.",
  theme: {
    cream: "#faf5ea",
    saffron: "#c8741d",
    forest: "#173f2d",
    ashoka: "#1d4f91",
    headerBackgroundColor: "#faf5ea",
    menuTextColor: "#3f3a32",
    menuHoverColor: "#c8741d",
    menuActiveColor: "#173f2d",
    menuButtonBackgroundColor: "#c8741d",
    menuButtonTextColor: "#ffffff"
  },
  contactEmail: "anandamatha@gmail.com",
  phone: "9656061997",
  address: "Kunnambetta P.O. 673 123, Wayanad District, Kerala, India",
  socialLinks: [{ label: "OCSO", url: "https://www.ocso.org" }],
  footerText:
    "A house of silence, prayer, work, and hospitality in the hills of Wayanad."
};

export const fallbackNavigation: NavigationItem[] = [
  { label: "Home", url: "/", order: 0 },
  {
    label: "Who are we ?",
    url: "/who-are-we",
    order: 1,
    children: [
      { label: "Cistercian order", url: "/cistercian-order", order: 0 },
      { label: "Our story", url: "/our-story", order: 1 },
      { label: "Monastic life", url: "/monastic-life", order: 2 },
      { label: "How to become", url: "/how-to-become", order: 3 }
    ]
  },
  { label: "About Us", url: "/about-us", order: 2 },
  { label: "History", url: "/history", order: 2 },
  { label: "Our Vision", url: "/our-vision", order: 3 },
  { label: "Monastic Life", url: "/monastic-life", order: 4 },
  { label: "Prayer", url: "/prayer", order: 5 },
  { label: "Work", url: "/work", order: 6 },
  { label: "Community", url: "/community", order: 7 },
  { label: "Hospitality", url: "/hospitality", order: 8 },
  { label: "Location", url: "/location", order: 9 },
  { label: "Contact", url: "/contact", order: 10 }
];

export const fallbackHome: HomePage = {
  heroTitle: "Welcome to Ananda Matha Monastery",
  heroSubtitle:
    "A Cistercian Monastery in the Wayanad District of Kerala, India.",
  heroImage: monasteryImage,
  heroSlides: [
    {
      image: monasteryImage,
      alt: "Ananda Matha Monastery in Kerala"
    },
    {
      image: gardenImage,
      alt: "Garden and monastic work"
    },
    {
      image: prayerImage,
      alt: "Prayerful hills of Wayanad"
    }
  ],
  heroButtonLabel: "Read more",
  heroButtonLink: "/about-us",
  heroButton: {
    label: "Read more",
    type: "internal",
    internalPage: { title: "About Us", slug: "about-us" }
  },
  heroButtons: [
    {
      enabled: true,
      style: "primary",
      link: {
        label: "Read more",
        type: "internal",
        internalPage: { title: "About Us", slug: "about-us" }
      }
    }
  ],
  values: [
    {
      title: "In silence, we listen.",
      text: "This is the rhythm of monastic life, where time slows down and hearts open to something greater."
    },
    {
      title: "In work, we serve.",
      text: "Manual work supports the community and joins us to creation, to our neighbors, and to the hidden life of Christ."
    },
    {
      title: "In prayer, we unite.",
      text: "The Divine Office, meditation, and lectio divina shape the hours of each day in praise and intercession."
    }
  ],
  cards: [
    {
      title: "About Our Monastery",
      text: "Founded in 1995, Ananda Matha Ashram is a community of Cistercian nuns living in simplicity, prayer, and hospitality.",
      frontText: "A Cistercian home in Kerala.",
      frontBackgroundColor: "#faf5ea",
      frontTextColor: "#173f2d",
      image: gardenImage,
      frontImage: gardenImage,
      backImage: gardenImage,
      backText: "Founded in 1995, Ananda Matha Ashram is a community of Cistercian nuns.",
      backBackgroundColor: "#173f2d",
      backTextColor: "#ffffff",
      buttonBackgroundColor: "#c8741d",
      buttonTextColor: "#ffffff",
      linkLabel: "Read more",
      link: "/about-us",
      button: {
        label: "Read more",
        type: "internal",
        internalPage: { title: "About Us", slug: "about-us" }
      },
      buttons: [
        {
          enabled: true,
          backgroundColor: "#c8741d",
          textColor: "#ffffff",
          link: {
            label: "Read more",
            type: "internal",
            internalPage: { title: "About Us", slug: "about-us" }
          }
        }
      ]
    },
    {
      title: "Our Life",
      text: "We follow the Rule of Saint Benedict in a rhythm of silence, liturgical prayer, manual work, and fraternal life.",
      frontText: "Prayer, work, silence, and community.",
      frontBackgroundColor: "#faf5ea",
      frontTextColor: "#173f2d",
      image: prayerImage,
      frontImage: prayerImage,
      backImage: prayerImage,
      backText: "A daily rhythm shaped by the Rule of Saint Benedict.",
      backBackgroundColor: "#173f2d",
      backTextColor: "#ffffff",
      buttonBackgroundColor: "#c8741d",
      buttonTextColor: "#ffffff",
      linkLabel: "Read more",
      link: "/monastic-life",
      button: {
        label: "Read more",
        type: "internal",
        internalPage: { title: "Monastic Life", slug: "monastic-life" }
      },
      buttons: [
        {
          enabled: true,
          backgroundColor: "#c8741d",
          textColor: "#ffffff",
          link: {
            label: "Read more",
            type: "internal",
            internalPage: { title: "Monastic Life", slug: "monastic-life" }
          }
        }
      ]
    },
    {
      title: "Monastic Hospitality",
      text: "Guests are welcomed with respect and dignity, and invited to share in the peace and prayer of the monastery.",
      frontText: "A quiet welcome for guests and retreatants.",
      frontBackgroundColor: "#faf5ea",
      frontTextColor: "#173f2d",
      image: monasteryImage,
      frontImage: monasteryImage,
      backImage: monasteryImage,
      backText: "Guests are welcomed with respect and invited into the peace of the monastery.",
      backBackgroundColor: "#173f2d",
      backTextColor: "#ffffff",
      buttonBackgroundColor: "#c8741d",
      buttonTextColor: "#ffffff",
      linkLabel: "Read more",
      link: "/hospitality",
      button: {
        label: "Read more",
        type: "internal",
        internalPage: { title: "Hospitality", slug: "hospitality" }
      },
      buttons: [
        {
          enabled: true,
          backgroundColor: "#c8741d",
          textColor: "#ffffff",
          link: {
            label: "Read more",
            type: "internal",
            internalPage: { title: "Hospitality", slug: "hospitality" }
          }
        }
      ]
    }
  ],
  story: {
    title: "Our Story",
    subtitle: "A Cistercian community in the hills of Wayanad",
    text:
      "Ananda Matha Ashram was founded as a place of prayer, silence, work, and hospitality. Rooted in the Cistercian tradition, the community seeks God in the ordinary rhythm of monastic life and welcomes guests into a peaceful home.",
    image: monasteryImage,
    backgroundColor: "#173f2d",
    textColor: "#ffffff",
    button: {
      label: "Read more",
      type: "internal",
      internalPage: { title: "History", slug: "history" }
    },
    buttons: [
      {
        enabled: true,
        style: "secondary",
        link: {
          label: "Read more",
          type: "internal",
          internalPage: { title: "History", slug: "history" }
        }
      }
    ]
  },
  photoBands: [
    {
      image: prayerImage,
      alt: "The hills of Wayanad around Ananda Matha Monastery",
      height: "large",
      overlay: false,
      caption: "Wayanad, Kerala"
    }
  ],
  visitingHoursTitle: "Visiting Hours",
  visitingHoursContent:
    "Mon - Fri: 8am-8pm\nSaturday: 9am-7pm\nSunday: 9am-8pm\n\nFor retreat stays or the hermitage, please contact the monastery before visiting.",
  visitingHoursImage: gardenImage,
  invitationText: "All are welcome to share in the peace and prayer of our home.",
  invitationButtonLabel: "Contact us",
  invitationButtonLink: "/contact",
  invitationButton: {
    label: "Contact us",
    type: "internal",
    internalPage: { title: "Contact", slug: "contact" }
  },
  invitationButtons: [
    {
      enabled: true,
      style: "secondary",
      link: {
        label: "Contact us",
        type: "internal",
        internalPage: { title: "Contact", slug: "contact" }
      }
    }
  ]
};

export const fallbackPages: PageContent[] = [
  {
    title: "Who are we ?",
    slug: "who-are-we",
    heroImage: monasteryImage,
    excerpt:
      "A Cistercian community seeking God through prayer, work, silence, and hospitality.",
    body:
      "Ananda Matha Monastery is a Cistercian community in Kerala, rooted in the Rule of Saint Benedict and the tradition of contemplative monastic life.\n\nThe community lives a daily rhythm of prayer, manual work, silence, study, and hospitality."
  },
  {
    title: "Cistercian Order",
    slug: "cistercian-order",
    heroImage: prayerImage,
    excerpt:
      "The Cistercian tradition follows the Rule of Saint Benedict in simplicity, prayer, and work.",
    body:
      "The Cistercian Order is a monastic family rooted in the Rule of Saint Benedict. Its life is marked by liturgical prayer, lectio divina, manual work, silence, simplicity, and fraternal charity.\n\nAnanda Matha Monastery belongs to this tradition and lives it in the cultural and spiritual landscape of Kerala."
  },
  {
    title: "Our Story",
    slug: "our-story",
    heroImage: gardenImage,
    excerpt:
      "The story of Ananda Matha Monastery, from its foundation to its life in Wayanad.",
    body:
      "Ananda Matha Ashram was founded as a place of prayer and monastic hospitality. Over time, the community came to Wayanad, where the hills, gardens, and quiet daily rhythm became part of its vocation.\n\nIts story is one of faithfulness, simplicity, and trust in God's providence."
  },
  {
    title: "How to Become",
    slug: "how-to-become",
    heroImage: monasteryImage,
    excerpt:
      "A first orientation for women discerning a Cistercian monastic vocation.",
    body:
      "A monastic vocation begins with listening. Anyone discerning this path is invited to take time for prayer, conversation, and patient accompaniment.\n\nThe first step is usually to contact the monastery and begin a simple dialogue with the community."
  },
  {
    title: "About Us",
    slug: "about-us",
    heroImage: monasteryImage,
    excerpt:
      "Ananda Matha Ashram Monastery is a Cistercian community in Kerala, rooted in prayer, work, silence, and hospitality.",
    body:
      "Ananda Matha Ashram Monastery is a Cistercian abbey of the Order of Cistercians of the Strict Observance (OCSO).\n\nIn the heart of India, among the lush mountains of Kerala, the community seeks God through the ordinary rhythm of monastic life. The Cistercian Order of the Strict Observance, also known as the Trappists, follows the Rule of Saint Benedict and the Cistercian tradition.\n\nIts members live a life of prayer, work, and silence, dedicated to seeking God through simplicity, contemplation, and hospitality. The order is present worldwide, offering places of retreat and spiritual reflection."
  },
  {
    title: "History",
    slug: "history",
    heroImage: gardenImage,
    excerpt:
      "Founded in 1995, the community moved to Kunnambetta in 2009 and was recognized as a priory on 7 October 2024.",
    body:
      "Ananda Matha Ashram is a monastic community of Cistercian nuns, also known as Trappistines. Founded in 1995 in India, the community first settled in another location before moving in 2009 to Kunnambetta, in the lush and peaceful district of Wayanad, Kerala.\n\nThe Cistercian presence in India includes two monasteries: Kurisumala Ashram, of the Syro-Malankara rite in Vagamon, and our community, of the Latin rite under the Diocese of Calicut. On 7th October 2024, our monastery was formally recognized as a priory, a major milestone on the path to autonomy within the Cistercian Order.\n\nOur founding house is Soleilmont Abbey, located in Fleurus, Belgium. This historical abbey continues to accompany us spiritually, under the paternal guidance of the Father Immediate, the Abbot of Scourmont Abbey."
  },
  {
    title: "Our Vision",
    slug: "our-vision",
    heroImage: prayerImage,
    excerpt:
      "The name Ananda means deep joy, a call to live in divine presence and communion with creation.",
    body:
      "The name Ananda, meaning deep joy in Sanskrit, reflects our aspiration to live in the divine presence, in peace, communion with creation, and fidelity to the Cistercian spirit of contemplation.\n\nWe follow the Rule of Saint Benedict, living a rhythm of silence, prayer, manual work, and fraternal life. Our days revolve around liturgical prayer, meditation, sustainable agriculture, and monastic hospitality."
  },
  {
    title: "Monastic Life",
    slug: "monastic-life",
    heroImage: monasteryImage,
    excerpt:
      "To live in God alone and to stand in his presence, to leave everything to attain peace.",
    body:
      "Cistercian monks and nuns live according to the Rule of Saint Benedict. The first word of this rule is LISTEN.\n\nEven after fourteen centuries, it remains a spiritual guide for many communities worldwide, thanks to its balance between prayer and work, solitude and community, love of God and love of neighbor.\n\nThose who follow this rule are pilgrims, seekers of God, attentive to His voice. The Rule of Saint Benedict is a path to happiness and freedom, guided by the Gospel."
  },
  {
    title: "Prayer",
    slug: "prayer",
    heroImage: prayerImage,
    excerpt:
      "Prayer is an encounter with God, a deep inner listening to what the Holy Spirit whispers in the heart.",
    body:
      "Jesus never left us a manual on prayer. Instead, He prayed, and in doing so, He taught us by example. He withdrew in silence, often at night. He prayed in secret, with humility. He trusted, gave thanks, and opened His heart fully to the Father.\n\nThe rhythm of prayer:\n4:00 Vigils - Meditation\n5:00 Reading Lectio\n6:00 Lauds\n7:00 Mass - Terce\n8:30 Work\n12:10 Sext\n14:15 None\n14:30 Study - Meeting\n15:30 Work\n17:30 Vespers - Meditation\n19:30 Compline\n\nPrayer transforms the heart. It attunes us to God, helping us see not with human eyes, but with the eyes of Christ."
  },
  {
    title: "Work",
    slug: "work",
    heroImage: gardenImage,
    excerpt:
      "They are truly monastic when they live by the labor of their hands.",
    body:
      "Ananda Matha Ashram owns a small property with a vegetable and flower garden, and a modest production of coffee and pepper. Our work includes everything needed in a household: cooking, cleaning, and building maintenance.\n\nBeyond these daily tasks, our main activity is the packaging of spices and products from organic farming, in preparation for export.\n\nWhen we work, we feel connected to the whole world. Manual labor holds a central place in our life and brings us closer to God, to Jesus, who lived an ordinary, humble life as a carpenter."
  },
  {
    title: "Community",
    slug: "community",
    heroImage: monasteryImage,
    excerpt:
      "The community forms a single body in Christ, each sister contributing to the upbuilding of relations within the community.",
    body:
      "Community life brings both deep joy and great strength. Yet it can also be challenging, because we have not chosen one another. It is God who has chosen each of us to live together.\n\nTo live true fraternal life, we must first come to know ourselves, recognizing not only our qualities, but also our faults and weaknesses.\n\nFraternal life calls for openness of heart, attentive listening, and true respect, welcoming others as they are, with their strengths and limitations."
  },
  {
    title: "Hospitality",
    slug: "hospitality",
    heroImage: gardenImage,
    excerpt:
      "All guests who present themselves are to be received like Christ.",
    body:
      "All guests who present themselves are to be received like Christ. The Benedictine tradition is founded on universal hospitality. Every guest, regardless of background, status, or religion, is welcomed with respect and dignity.\n\nVisitors are invited to share in the prayer of the community in whatever way they feel called, immersing themselves in an atmosphere of serenity and reflection.\n\nWe have a small guesthouse with three rooms, offering a simple and peaceful space for those who wish to take time for reflection, prayer, and connection with the community."
  },
  {
    title: "Location",
    slug: "location",
    heroImage: monasteryImage,
    excerpt:
      "The monastery lies on the road between Gudalur and Chundale, near Kunnambetta in Wayanad.",
    body:
      "Nearest airport: the closest airport to Kunnambetta is Calicut International Airport, also known as Kozhikode.\n\nBy bus from Bangalore, take any bus to Kerala via Mysore and stop at Kalpetta. From Kalpetta, take a short bus ride to Chundale, then a bus in the direction of Meppadi.\n\nBy car, the monastery lies on the road between Gudalur and Chundale, halfway between Chundale and Meppadi. From Meppadi, drive about 5 km to reach the Redemptorist Fathers' House. From there, take the road towards Chembra Peak. After 300 meters, turn right: Ananda Matha Ashram is signposted."
  },
  {
    title: "Contact",
    slug: "contact",
    heroImage: prayerImage,
    excerpt: "Contact Ananda Matha Monastery for visits, retreats, and hospitality.",
    body:
      "Ananda Matha Monastery\nKunnambetta P.O. 673 123\nWayanad District\nKerala\nIndia\n\nPhone: 9656061997\nEmail: anandamatha@gmail.com\n\nOpening hours:\nMonday - Friday: 8 h - 19 h\nSaturday: 9 h - 19 h\nSunday: 9 h - 19 h"
  }
];
