import { getSocialMentions } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Instagram, Twitter, Heart, MessageCircle, Repeat2 } from "lucide-react";

const platformIcons: Record<string, any> = {
  INSTAGRAM: Instagram,
  TWITTER: Twitter,
};

const sentimentColors: Record<string, string> = {
  POSITIVE: "bg-emerald-100 text-emerald-700",
  NEGATIVE: "bg-red-100 text-red-700",
  NEUTRAL: "bg-gray-200 text-gray-700",
};

export default async function SocialPage() {
  const mentions = await getSocialMentions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-gray-900">Social Intel</h1>
        <p className="text-sm text-gray-500">Track brand mentions & social engagement</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-none shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-pink-100">
              <Instagram className="size-5 text-pink-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{mentions.filter((m: any) => m.platform === "INSTAGRAM").length}</p>
              <p className="text-xs text-gray-500">Instagram Mentions</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-blue-100">
              <Twitter className="size-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{mentions.filter((m: any) => m.platform === "TWITTER").length}</p>
              <p className="text-xs text-gray-500">Twitter/X Mentions</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-100">
              <Heart className="size-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">
                {mentions.filter((m: any) => m.sentiment === "POSITIVE").length}
              </p>
              <p className="text-xs text-gray-500">Positive Sentiment</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Recent Mentions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {mentions.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <Globe className="size-10 text-gray-300" />
              <p className="text-sm text-gray-400">No social mentions tracked yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {mentions.map((m: any) => {
                const PlatformIcon = platformIcons[m.platform] ?? Globe;
                return (
                  <div key={m.id} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50/50 transition-colors">
                    <PlatformIcon className="mt-0.5 size-4 text-gray-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-700 line-clamp-2">{m.content}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-[10px] text-gray-400">@{m.authorHandle}</span>
                        <Badge variant="secondary" className={`text-[9px] ${sentimentColors[m.sentiment] ?? ""}`}>
                          {m.sentiment}
                        </Badge>
                        {m.engagementScore > 0 && (
                          <span className="text-[10px] text-gray-400">
                            Score: {m.engagementScore}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
