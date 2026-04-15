export const faqSections = [
  {
    id: "general",
    title: "Getting to know FasterQ",
    icon: "🚀",
    faqs: [
      {
        question: "What is FasterQ?",
        answer: "FasterQ is a privacy-focused call details and call management app that helps you see deeper insights about your calls — like detailed history, spam detection, notes, and analytics — without changing your SIM or phone number. It works on top of your existing dialer and shows you smart information before and after calls.",
      },
      {
        question: "Who is FasterQ built for?",
        answer: "FasterQ is designed primarily for business users, sales teams, support teams, founders, and professionals who handle a lot of calls and want better visibility into who-called / whom-you-called, along with spam safety and organized history. Individual users who want more control and context on their calls can also use it.",
      },
      {
        question: "Is FasterQ a separate dialer app?",
        answer: "No. FasterQ is not a full replacement dialer. It works on top of your existing phone dialer. We analyze allowed call logs, sync them securely, and show you rich call details, spam detection, and insights inside the app and web dashboard.",
      },
      {
        question: "Does FasterQ work without internet?",
        answer: "Your normal calls always go through your SIM, so calling itself does not depend on FasterQ. However, to sync call logs, back up data, and show analytics or AI insights, an active internet connection is required. If you are offline, data will sync once you reconnect.",
      },
      {
        question: "On which platforms is FasterQ available?",
        answer: "FasterQ is primarily available on Android (mobile app) along with a web dashboard for analysis and team usage. iOS and other platforms may be introduced later and will be announced on our website.",
      },
    ],
  },
  {
    id: "getting-started",
    title: "Installation & Getting Started",
    icon: "⚡",
    faqs: [
      {
        question: "How do I install FasterQ?",
        answer: "You can download FasterQ from the Google Play Store (Android). Once installed, open the app, verify your mobile number or sign in, grant the required permissions, and your call history will gradually start syncing based on permissions allowed by your device.",
      },
      {
        question: "Which permissions does FasterQ need and why?",
        answer: "FasterQ needs: Phone & Call Logs (to read call history), Contacts (to map numbers to names), Storage (for recordings/notes), and Notifications (for alerts). We only request permissions required for core functionality. You can revoke permissions anytime from your phone settings.",
      },
      {
        question: "Do I need to create an account to use FasterQ?",
        answer: "Yes. To enable secure backup, multi-device login, and a web dashboard, FasterQ uses an account-based system. Basic profile information like your name, email, and verified phone number helps us sync your data across devices.",
      },
      {
        question: "Does FasterQ work on dual SIM phones?",
        answer: "Yes, FasterQ can read call logs from dual SIM devices, depending on how your device and OEM expose this data. In some rare models or ROMs, there may be limitations due to manufacturer restrictions.",
      },
    ],
  },
  {
    id: "features",
    title: "Features & Usage",
    icon: "✨",
    faqs: [
      {
        question: "What information does FasterQ show for each call?",
        answer: "For each call, FasterQ shows: Caller name, Number, Call type (incoming/outgoing/missed), Call duration and time, Spam/safe indicators, Notes or tags, History with that number, and AI insights over time.",
      },
      {
        question: "Does FasterQ support call recording?",
        answer: "FasterQ can read and manage recordings from non-Google dialer setups where call recording is supported by the device and OS. On many phones using the official Google Dialer, Android imposes restrictions that prevent apps from accessing call audio.",
      },
      {
        question: "Can I search and filter my call history in FasterQ?",
        answer: "Yes, FasterQ is designed to make searching your call data easy. You can search by name, number, and in supported views filter by call type, time-period, spam vs. safe, and other parameters depending on your version and plan.",
      },
      {
        question: "What is the FasterQ web dashboard used for?",
        answer: "The web dashboard allows you to: View and analyze call history from a larger screen, See trends and AI insights, Manage team-level visibility (for business accounts), and Export certain reports (where enabled).",
      },
      {
        question: "What kind of AI insights does FasterQ provide?",
        answer: "FasterQ highlights patterns such as: Most frequent callers and missed opportunities, Business vs. spam ratio over time, Follow-up suggestions, and Peak time slots when your incoming calls are highest. These insights are purely analytical and based on call metadata.",
      },
    ],
  },
  {
    id: "recording-limitations",
    title: "Call Recording & Limitations",
    icon: "🎙️",
    faqs: [
      {
        question: "Why doesn't FasterQ record calls on my phone?",
        answer: "Call recording support depends on your phone brand, Android version, whether you're using Google Dialer or custom OEM dialer, and local laws. On many newer Android devices with Google Dialer, third-party apps cannot access call audio.",
      },
      {
        question: "Is call recording legal with FasterQ?",
        answer: "Laws around call recording vary by country and region. Some jurisdictions require notifying the other party, some require consent, and some block it entirely. It is your responsibility to ensure compliance with applicable laws in your jurisdiction.",
      },
      {
        question: "Does FasterQ record my personal calls too?",
        answer: "FasterQ works on top of your device call logs. If you're using FasterQ for business, we recommend using a dedicated number or device for official use. Features like analytics or recordings may apply to all calls on the configured SIM.",
      },
    ],
  },
  {
    id: "privacy-security",
    title: "Data, Privacy & Security",
    icon: "🔒",
    faqs: [
      {
        question: "Where is my FasterQ data stored?",
        answer: "FasterQ stores your synced data securely on AWS EC2 + MongoDB in the Mumbai (India) region. This helps ensure low latency for Indian users and keeps data within a reputed cloud provider's infrastructure.",
      },
      {
        question: "What data does FasterQ sync to the cloud?",
        answer: "FasterQ may sync: Call metadata (number, time, duration, type), Spam/safe classification, Contact names, Notes and labels, and Recordings from supported devices. We do not sell your data to third parties.",
      },
      {
        question: "Who owns the data inside FasterQ?",
        answer: "You do. The data generated from your calls remains yours. FasterQ acts as a processor and secure platform to help you view, manage, and analyze it. If you delete your account, we follow our data retention and deletion policy.",
      },
      {
        question: "How long does FasterQ keep my data?",
        answer: "By default, FasterQ retains your data for as long as your account is active and for a limited period after account closure, primarily for legal, backup, and fraud-prevention reasons. Exact timelines are documented in our Privacy Policy.",
      },
      {
        question: "How does FasterQ protect my privacy?",
        answer: "We follow industry-standard security practices: Encrypted connections (HTTPS/SSL), Secure cloud infrastructure on AWS, Access controls and internal security measures, and Regular monitoring and reviews. For full details, please refer to the Privacy Policy.",
      },
    ],
  },
  {
    id: "billing",
    title: "Plans, Billing & Subscription",
    icon: "💳",
    faqs: [
      {
        question: "Is FasterQ free or paid?",
        answer: "FasterQ may offer a combination of free and paid plans, depending on the features you need (like advanced analytics, team usage, or extended history). Please refer to our pricing page for the most up-to-date information.",
      },
      {
        question: "Do you offer a free trial?",
        answer: "We aim to make it easy for you to try FasterQ before committing. Free trial availability and duration may change over time. Please check the app or website for current trial details.",
      },
      {
        question: "How can I cancel my FasterQ subscription?",
        answer: "If you're on a paid plan, you can cancel from within the billing section of your account or by contacting our support team at info@fasterq.in. Once cancelled, your plan will remain active until the end of the current billing cycle.",
      },
      {
        question: "Will my data be deleted if I cancel?",
        answer: "Simply cancelling a subscription does not immediately delete all your data. If you want your data removed, you may need to request account deletion. Please review our Privacy Policy or contact support for details.",
      },
    ],
  },
  {
    id: "support",
    title: "Troubleshooting & Support",
    icon: "🛠️",
    faqs: [
      {
        question: "Why is FasterQ not showing recent calls correctly?",
        answer: "This can happen due to: Missing call log permission, Battery optimization or background restrictions, OEM-specific limitations, or Recent OS updates. Please ensure all required permissions are granted and remove the app from aggressive battery optimization.",
      },
      {
        question: "Spam or caller info is not appearing on my screen. What should I do?",
        answer: "Make sure: Overlay/draw-over-other-apps permission is enabled, Notification access is enabled, and Battery optimization is disabled for FasterQ. Some phones restrict overlays on the default dialer.",
      },
      {
        question: "How do I contact FasterQ support?",
        answer: "You can reach us at info@fasterq.in. Please include your phone model, Android version, and a brief description or screenshot of the issue so we can assist you faster.",
      },
      {
        question: "What should I do if I change my phone or reset my device?",
        answer: "Install FasterQ on your new device, log in with the same account, and grant the required permissions. Your cloud-synced data will start appearing again, subject to your plan and retention policies.",
      },
    ],
  },
];
