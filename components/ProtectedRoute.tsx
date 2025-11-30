import OnboardingScreen from "@/components/screens/OnboardingScreen";
import { auth } from "@/firebase/config";
// 로그인 x 시 화면

export default function ProtectedRoute({
    children,
}: {
    children: React.ReactNode;
}) {
    // 로그인 여부 있으면 
    const user = auth.currentUser;

    if( !user) {
        return <OnboardingScreen />;
    }
    return <>{children}</>;
}