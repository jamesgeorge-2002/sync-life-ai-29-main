/**
 * Razorpay Payment Integration
 * Key ID: rzp_test_Tg8m1evDvdAwd9
 */

const RAZORPAY_KEY_ID = "rzp_test_Tg8m1evDvdAwd9";

export interface RazorpayOptions {
  amount: number; // in paise (₹999 = 99900)
  currency: string;
  name: string;
  description: string;
  planName: string;
  userEmail?: string;
  userName?: string;
  userId?: string;
  onSuccess: (paymentId: string, planName: string) => void;
  onError?: (error: any) => void;
  onDismiss?: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

/**
 * Dynamically loads the Razorpay checkout script
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Opens Razorpay checkout modal for a given plan
 */
export async function openRazorpayCheckout(opts: RazorpayOptions): Promise<void> {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    throw new Error("Razorpay SDK failed to load. Please check your internet connection.");
  }

  const options = {
    key: RAZORPAY_KEY_ID,
    amount: opts.amount,
    currency: opts.currency || "INR",
    name: "LIFE-SYNC AI",
    description: opts.description,
    image: "", // Logo URL can be placed here
    prefill: {
      email: opts.userEmail || "",
      name: opts.userName || "",
    },
    notes: {
      userId: opts.userId || "",
      plan: opts.planName,
    },
    theme: {
      color: "#8b5cf6", // Purple gradient matching app theme
    },
    modal: {
      ondismiss: () => {
        if (opts.onDismiss) opts.onDismiss();
      },
    },
    handler: (response: { razorpay_payment_id: string }) => {
      opts.onSuccess(response.razorpay_payment_id, opts.planName);
    },
  };

  const razorpay = new window.Razorpay(options);
  razorpay.on("payment.failed", (resp: any) => {
    if (opts.onError) opts.onError(resp.error);
  });
  razorpay.open();
}

export interface Plan {
  name: string;
  price: string;
  priceInPaise: number;
  period: string;
  description: string;
  badge?: string;
  featured: boolean;
  color: string;
  features: string[];
  cta: string;
}

export const PLANS: Plan[] = [
  {
    name: "Free",
    price: "₹0",
    priceInPaise: 0,
    period: "/forever",
    description: "Get started with the essentials.",
    featured: false,
    color: "from-slate-500 to-slate-600",
    features: [
      "Tasks, Notes & Calendar",
      "Habit & Goal Tracking",
      "Finance & Mood Journal",
      "1 GB Vault Storage",
      "Community Support",
    ],
    cta: "Current Plan",
  },
  {
    name: "Pro",
    price: "₹999",
    priceInPaise: 99900,
    period: "/month",
    description: "Unlock AI-powered life optimization.",
    badge: "Most Popular",
    featured: true,
    color: "from-violet-600 via-purple-600 to-indigo-600",
    features: [
      "Full RAG Chatbot & Doc Search",
      "All Domain AI Assistants",
      "AI Morning Briefing & Schedule Optimizer",
      "AI-powered Action Dispatch across apps",
      "50 GB Encrypted Vault",
      "Priority Gemini 1.5/2.0 API Routing",
      "Advanced Analytics & Reports",
    ],
    cta: "Upgrade to Pro",
  },
  {
    name: "Team",
    price: "₹2499",
    priceInPaise: 249900,
    period: "/month",
    description: "Collaborate and scale with your team.",
    badge: "Enterprise",
    featured: false,
    color: "from-amber-500 via-orange-500 to-rose-500",
    features: [
      "Everything in Pro",
      "Shared Workspaces & Collaboration",
      "Multi-user RAG Document Index",
      "Admin Management & SSO",
      "Dedicated High-Speed API Access",
      "Custom AI Model Fine-tuning",
      "SLA-backed 99.9% Uptime",
    ],
    cta: "Upgrade to Team",
  },
];
