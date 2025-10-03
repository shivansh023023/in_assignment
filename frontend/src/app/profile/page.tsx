import { getSessionUser } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default async function ProfilePage() {
  const user = await getSessionUser();
  const avatarImage = PlaceHolderImages.find(p => p.id === 'profile-avatar');

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24 text-3xl">
                  {avatarImage && <AvatarImage src={avatarImage.imageUrl} alt={user.name} />}
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="font-headline text-3xl">{user.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-center">
                <div className="text-lg">
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <p className="text-sm text-muted-foreground pt-4">This is your profile page. More features coming soon!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
