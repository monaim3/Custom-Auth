import LoginForm from "@/app/components/auth/LoginForm";
import Image from "next/image";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex">
            <div className="hidden lg:flex lg:w-1/2 bg-[#D6E4F5] items-center justify-center p-12">

                <div className="relative w-full h-80">
                    <Image
                        src="/login.png"
                        alt="login"
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority
                        className="object-contain"
                    />
                </div>
            </div>
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-[#FAFBFC]">
                <div className="w-full max-w-md">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}