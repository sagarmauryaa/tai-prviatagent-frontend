'use client';
import { MouseEventHandler, useEffect, useState } from "react";
import { Typography, Card, CardContent, Button, Rating, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Grid from "@mui/material/Grid2";
import { getBrandReview } from "@/utils/backend-endpoints";
import { useAuth } from "@/components/auth/auth-context";
import { reviewCodeScript } from "@/constant/integration-code-snippets";
import { CopyAll } from "@mui/icons-material";
import { BRAND_PAGE_URL } from "@/utils/config";

interface ReviewStateProps {
	averageRating: number;
	fiveStarCount: number;
	fiveStarPercentage: number;
	fourStarCount: number;
	fourStarPercentage: number;
	threeStarCount: number;
	threeStarPercentage: number;
	twoStarCount: number;
	twoStarPercentage: number;
	oneStarCount: number;
	oneStarPercentage: number;
	link: string;
}
const RatingWidget = () => {
	const { selectedBrand } = useAuth();
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const [codeSinppet, setCodeSinppet] = useState('');
	const [copySuccess, setCopySuccess] = useState(false);

	const [stateData, setStateData] = useState<ReviewStateProps>({
		averageRating: 0,
		fiveStarCount: 0,
		fiveStarPercentage: 0,
		fourStarCount: 0,
		fourStarPercentage: 0,
		threeStarCount: 0,
		threeStarPercentage: 0,
		twoStarCount: 0,
		twoStarPercentage: 0,
		oneStarCount: 0,
		oneStarPercentage: 0,
		link: ''
	});
	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(codeSinppet);
			setCopySuccess(true);
			setTimeout(() => setCopySuccess(false), 2000);
		} catch (error) {
			console.error('Failed to copy text:', error);
		}
	};
	const getPrompts = async (id: string, apikey: string) => {
		try {
			const { data, status } = await getBrandReview(id, apikey);
			if (status == 200) {
				setStateData((prev) => ({ ...prev, ...data.data }))
			}
		} catch (error: any) {

		}
	}

	// useEffect(() => {
	// 	if (selectedBrand) {
	// 		getPrompts(selectedBrand._id, selectedBrand.apiKey)
	// 		setStateData((prev) => ({ ...prev, link: selectedBrand.tellofyBrandUrl }));
	// 		const code = reviewCodeScript(selectedBrand?._id, selectedBrand.apiKey);
	// 		setCodeSinppet(code)
	// 	}
	// }, [selectedBrand]);
 
	
	return (
		<Grid size={{ md: 6, sm: 12 }} spacing={4}>
			<Card>
				<CardContent >
					<div className="ratingWidget_container">
						<div className="ratingWidget">
							<div className="ratingWidget_rate">
								<Rating name="half-rating" defaultValue={stateData.averageRating ?? 0} precision={1} disabled />
								<IconButton onClick={handleClick} size="small">
									<MoreVertIcon />
								</IconButton>
								<Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
									<div className="ratingWidget_rateMenu">
										<p>Average rating {stateData.averageRating ?? 0}/5</p>
										<ul>
											<li>5 stars ({stateData.fiveStarCount ?? 0})</li>
											<li>4 stars ({stateData.fourStarCount ?? 0})</li>
											<li>3 stars ({stateData.threeStarCount ?? 0})</li>
											<li>2 stars ({stateData.twoStarCount ?? 0})</li>
											<li>1 star ({stateData.oneStarCount ?? 0})</li>
										</ul>
										<a href="#">See all ratings</a>
									</div>
								</Menu>
							</div>
							<Typography variant="h3" className="ratingWidget_count">{stateData.averageRating ?? 0}/ 5</Typography>
							<Typography variant="body1" className="ratingWidget_based">Based on _ reviews <a href={`${BRAND_PAGE_URL}/brand/${stateData.link}`} target="_blank">Read all reviews</a></Typography>
							<Typography variant="caption" className="ratingWidget_based">Powered by <strong>tellofy</strong></Typography>
						</div>
						<Button onClick={handleCopy} type="button" variant="contained" sx={{ flex: "1 1 auto" }} className="">
							{copySuccess ? 'Copied!' : 'Copy Code'}&nbsp; <CopyAll fontSize="small" />
						</Button>
					</div>
				</CardContent>
			</Card>
		</Grid>
	);
};

export default RatingWidget;
