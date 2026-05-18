"use client";
import { VerticalLayout } from "@/components/dashboard/layout/vertical/vertical-layout";
import { useAuth } from "@/components/auth/auth-context";
import PageLoader from "@/components/dashboard/layout/loader"; 

export default function Layout({ children }: { children: React.ReactNode }) {
	const { isLoading } = useAuth();

	return <VerticalLayout>{
		!isLoading ? children : <PageLoader />
	} 
	</VerticalLayout>;
}
