import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import {
  Crown,
  Check,
  Sparkles,
  Zap,
  Shield,
  Bot,
  Star,
  ArrowRight,
  CreditCard,
  Lock,
  RefreshCw,
  CheckCircle2,
  Users,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile, UserProfile } from "@/lib/db";
import { toast } from "sonner";
import { openRazorpayCheckout, PLANS, Plan } from "@/lib/razorpay";

export const Route = createFileRoute("/app/premium")({ component: PremiumPage });

const planIcons: Record<string, React.ReactNode> = {
  Free: <Zap className="h-6 w-6" />,
  Pro: <Sparkles className="h-6 w-6" />,
  Team: <Users className="h-6 w-6" />,
};

const trustBadges = [
  { icon: <Lock className="h-4 w-4" />, label: "256-bit SSL Encrypted" },
  { icon: <Shield className="h-4 w-4" />, label: "PCI DSS Compliant" },
  { icon: <RefreshCw className="h-4 w-4" />, label: "Cancel Anytime" },
  { icon: <CreditCard className="h-4 w-4" />, label: "All Indian Cards Accepted" },
];

const testimonials = [
  {
    name: "Arjun Sharma",
    role: "Product Manager",
    avatar: "AS",
    text: "LIFE-SYNC Pro transformed how I manage my day. The AI briefing alone saves me 2 hours every morning.",
    stars: 5,
  },
  {
    name: "Priya Nair",
    role: "Startup Founder",
    avatar: "PN",
    text: "The RAG chatbot understands my documents better than I do. Worth every rupee!",
    stars: 5,
  },
  {
    name: "Rahul Verma",
    role: "Data Engineer",
    avatar: "RV",
    text: "Finally, an AI assistant that actually knows my goals, habits, and schedule all together.",
    stars: 5,
  },
];

function PremiumPage() {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [successPlan, setSuccessPlan] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!authUser) return;
      try {
        const data = await getUserProfile(authUser.uid);
        if (data) setProfile(data);
      } catch (err) {
        console.error("Failed to load user profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [authUser]);

  const currentPlan = (profile?.tier || "Free").toLowerCase();

  const handleChoosePlan = async (plan: Plan) => {
    if (!authUser) {
      toast.error("Please log in to continue.");
      return;
    }

    // If already on this plan
    if (currentPlan === plan.name.toLowerCase()) {
      toast.info(`You're already on the ${plan.name} plan.`);
      return;
    }

    // Free plan — just update directly
    if (plan.priceInPaise === 0) {
      setProcessingPlan(plan.name);
      try {
        await updateUserProfile(authUser.uid, { tier: plan.name });
        setProfile((prev) => (prev ? { ...prev, tier: plan.name } : null));
        toast.success(`Switched to ${plan.name} plan.`);
      } catch (err) {
        toast.error("Failed to update plan.");
      } finally {
        setProcessingPlan(null);
      }
      return;
    }

    // Paid plan — open Razorpay
    setProcessingPlan(plan.name);
    try {
      await openRazorpayCheckout({
        amount: plan.priceInPaise,
        currency: "INR",
        name: "LIFE-SYNC AI",
        description: `${plan.name} Plan — Monthly Subscription`,
        planName: plan.name,
        userEmail: authUser.email || undefined,
        userName: authUser.displayName || undefined,
        userId: authUser.uid,
        onSuccess: async (paymentId, planName) => {
          try {
            await updateUserProfile(authUser.uid, { tier: planName });
            setProfile((prev) => (prev ? { ...prev, tier: planName } : null));
            setSuccessPlan(planName);
            toast.success(
              `🎉 Payment successful! Welcome to ${planName}. Payment ID: ${paymentId}`,
              { duration: 6000 }
            );
          } catch (err) {
            toast.error("Payment succeeded but profile update failed. Please contact support.");
          } finally {
            setProcessingPlan(null);
          }
        },
        onError: (err) => {
          console.error("Razorpay payment error:", err);
          toast.error(`Payment failed: ${err?.description || "Please try again."}`);
          setProcessingPlan(null);
        },
        onDismiss: () => {
          setProcessingPlan(null);
        },
      });
    } catch (err: any) {
      toast.error(err?.message || "Failed to open payment gateway.");
      setProcessingPlan(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <PageHeader
        title="Choose Your Plan"
        description="Unlock the full power of LIFE-SYNC AI — your intelligent life operating system."
        icon={<Crown className="h-5 w-5" />}
      />

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-900/40 via-purple-900/30 to-indigo-900/40 p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/40 bg-violet-500/15 px-4 py-1 text-xs font-bold text-violet-300 mb-4">
            <Sparkles className="h-3 w-3" /> Powered by Gemini AI & RAG Neural Engine
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-2">
            Your AI Life Command Center
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-sm text-violet-200/80">
            Join thousands of professionals using LIFE-SYNC AI to master their tasks, health, finance, and goals with the power of Generative AI.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-xs text-violet-300/70">
            {["14,000+ Active Users", "99.9% Uptime", "₹0 Setup Fee", "Instant Activation"].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {PLANS.map((plan) => {
          const isCurrent = currentPlan === plan.name.toLowerCase();
          const isProcessing = processingPlan === plan.name;
          const isSuccess = successPlan === plan.name;

          return (
            <div
              key={plan.name}
              className={`relative flex flex-col overflow-hidden rounded-3xl border transition-all duration-300 ${
                plan.featured
                  ? "border-violet-500/60 bg-gradient-to-b from-violet-950/80 via-background to-background shadow-2xl shadow-violet-500/10 scale-[1.03]"
                  : "border-border/60 bg-card/80 hover:border-violet-500/30 hover:shadow-lg"
              }`}
            >
              {/* Featured badge */}
              {plan.badge && (
                <div className={`absolute -top-px left-0 right-0 h-1 bg-gradient-to-r ${plan.color}`} />
              )}

              <div className="p-6 flex-1">
                {/* Plan badge */}
                {plan.badge && (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${plan.color} px-3 py-0.5 text-[10px] font-black text-white mb-3`}
                  >
                    {plan.name === "Pro" ? <Star className="h-3 w-3" /> : <Building2 className="h-3 w-3" />}
                    {plan.badge}
                  </span>
                )}

                {/* Icon + name */}
                <div className="flex items-center gap-3 mb-1">
                  <div
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${plan.color} text-white shadow-md`}
                  >
                    {planIcons[plan.name]}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-foreground">{plan.name}</h3>
                    <p className="text-[11px] text-muted-foreground">{plan.description}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mt-5 mb-5">
                  <span
                    className={`text-4xl font-black bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}
                  >
                    {plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">{plan.period}</span>
                </div>

                {/* Divider */}
                <div className="border-t border-border/50 my-4" />

                {/* Features */}
                <ul className="space-y-2.5">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-sm">
                      <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500/15 mt-0.5">
                        <Check className="h-3 w-3 text-emerald-500" />
                      </div>
                      <span className="text-muted-foreground">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <div className="p-6 pt-0">
                {isCurrent ? (
                  <div className="flex items-center justify-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 py-2.5 text-sm font-bold text-emerald-500">
                    <CheckCircle2 className="h-4 w-4" />
                    Current Plan
                  </div>
                ) : isSuccess ? (
                  <div className="flex items-center justify-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 py-2.5 text-sm font-bold text-emerald-500 animate-in fade-in-0 duration-500">
                    <CheckCircle2 className="h-4 w-4" />
                    Plan Activated!
                  </div>
                ) : (
                  <Button
                    onClick={() => handleChoosePlan(plan)}
                    disabled={isProcessing || processingPlan !== null}
                    className={`w-full rounded-full font-bold transition-all duration-300 h-11 text-sm cursor-pointer ${
                      plan.featured
                        ? `bg-gradient-to-r ${plan.color} text-white hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-500/30`
                        : plan.name === "Team"
                        ? `bg-gradient-to-r ${plan.color} text-white hover:scale-[1.02] hover:shadow-lg hover:shadow-amber-500/30`
                        : "border border-border bg-background hover:bg-accent"
                    }`}
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Processing...
                      </span>
                    ) : plan.priceInPaise > 0 ? (
                      <span className="flex items-center gap-1.5">
                        <CreditCard className="h-4 w-4" />
                        {plan.cta}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    ) : (
                      plan.cta
                    )}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Trust Badges */}
      <div className="flex flex-wrap items-center justify-center gap-6 rounded-2xl border border-border/50 bg-card/50 px-6 py-4">
        <span className="text-xs font-semibold text-muted-foreground">Secured by Razorpay</span>
        <div className="h-4 w-px bg-border" />
        {trustBadges.map((b) => (
          <div key={b.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="text-emerald-500">{b.icon}</span>
            {b.label}
          </div>
        ))}
      </div>

      {/* Feature comparison */}
      <div className="rounded-3xl border border-border/60 bg-card/60 overflow-hidden backdrop-blur-xl">
        <div className="px-6 py-5 border-b border-border/60">
          <h3 className="text-base font-bold flex items-center gap-2">
            <Bot className="h-4 w-4 text-primary" />
            AI Features Deep Dive
          </h3>
          <p className="text-xs text-muted-foreground mt-1">Everything that makes LIFE-SYNC Pro worth it</p>
        </div>
        <div className="divide-y divide-border/50">
          {[
            { feature: "RAG Chatbot with Document Q&A", free: false, pro: true, team: true },
            { feature: "AI Daily Executive Briefing", free: false, pro: true, team: true },
            { feature: "AI Schedule Optimizer", free: false, pro: true, team: true },
            { feature: "Health, Finance & Study AI", free: false, pro: true, team: true },
            { feature: "Action Dispatch across apps", free: false, pro: true, team: true },
            { feature: "AI-powered Goal Planning", free: false, pro: true, team: true },
            { feature: "Priority Gemini API routing", free: false, pro: true, team: true },
            { feature: "Shared workspaces", free: false, pro: false, team: true },
            { feature: "Multi-user RAG indexing", free: false, pro: false, team: true },
            { feature: "Admin management & SSO", free: false, pro: false, team: true },
          ].map((row) => (
            <div key={row.feature} className="grid grid-cols-4 items-center px-6 py-3 text-sm hover:bg-muted/20 transition-colors">
              <span className="col-span-1 text-muted-foreground text-xs">{row.feature}</span>
              <div className="flex justify-center">
                {row.free ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  <span className="h-4 w-4 flex items-center justify-center text-muted-foreground/30 text-lg">—</span>
                )}
              </div>
              <div className="flex justify-center">
                {row.pro ? (
                  <Check className="h-4 w-4 text-violet-500" />
                ) : (
                  <span className="h-4 w-4 flex items-center justify-center text-muted-foreground/30 text-lg">—</span>
                )}
              </div>
              <div className="flex justify-center">
                {row.team ? (
                  <Check className="h-4 w-4 text-amber-500" />
                ) : (
                  <span className="h-4 w-4 flex items-center justify-center text-muted-foreground/30 text-lg">—</span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-4 px-6 py-3 border-t border-border/60 text-xs font-semibold text-muted-foreground">
          <span>Feature</span>
          <span className="text-center">Free</span>
          <span className="text-center text-violet-400">Pro</span>
          <span className="text-center text-amber-400">Team</span>
        </div>
      </div>

      {/* Testimonials */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-center flex items-center justify-center gap-2">
          <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
          Loved by Professionals Across India
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-sm hover:border-violet-500/30 transition-all"
            >
              <div className="flex items-center gap-0.5 mb-3">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">"{t.text}"</p>
              <div className="flex items-center gap-2.5">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-xs font-bold text-white">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-xs font-semibold">{t.name}</p>
                  <p className="text-[10px] text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="rounded-3xl border border-border/60 bg-card/60 overflow-hidden backdrop-blur-xl">
        <div className="px-6 py-5 border-b border-border/60">
          <h3 className="text-base font-bold">Frequently Asked Questions</h3>
        </div>
        <div className="divide-y divide-border/50">
          {[
            {
              q: "What payment methods are accepted?",
              a: "All Indian debit cards, credit cards, UPI (PhonePe, GPay, Paytm), net banking, and major wallets are accepted via Razorpay.",
            },
            {
              q: "Can I cancel my subscription anytime?",
              a: "Yes, you can cancel anytime from your account settings. Your Pro features remain active until the end of the billing period.",
            },
            {
              q: "Is my payment data secure?",
              a: "Absolutely. All payments are processed through Razorpay with 256-bit SSL encryption and PCI DSS compliance. We never store card details.",
            },
            {
              q: "What happens to my data if I downgrade?",
              a: "Your data is always safe. If you downgrade, AI features are locked but all your tasks, notes, and data remain intact.",
            },
          ].map((faq) => (
            <div key={faq.q} className="px-6 py-4">
              <p className="text-sm font-semibold text-foreground mb-1">{faq.q}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}