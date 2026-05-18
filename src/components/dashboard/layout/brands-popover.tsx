'use client';
import { useAuth } from "@/components/auth/auth-context";
import { Option } from "@/components/core/option";
import { InputLabel } from "@mui/material";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const BrandsPopover = ({ isLabel = true }: { isLabel?: boolean }) => {
    const { brands, selectedBrand, setSelectedBrand } = useAuth();
    const handleBrandChange = (event: any) => {
        const brand = brands?.find(b => b._id === event.target.value);
        setSelectedBrand(brand ?? null);
    }
    const pathname = usePathname();
    const isDisabled = useMemo(() => { return pathname === '/dashboard' }, [pathname]);


    if (brands?.length == 0 || isDisabled) return null;

    // useEffect(() => {
    //     if (typeof window !== 'undefined') {
    //         const searchParams = new URLSearchParams(window.location.search)
    //         const brandId = searchParams.get('brandId');
    //         if (brandId) {
    //             const brand = brands?.find(b => b._id === brandId);
    //             if (brand) {
    //                 setSelectedBrand(brand ?? null)
    //             }
    //         }
    //     }
    // }, [brands, setSelectedBrand]);


    return (
        <Stack spacing={2} sx={{ p: 2 }} direction={"row"} className="brands-dropdown " >
            {
                isLabel ?
                    <InputLabel sx={{ color: "var(--NavGroup-title-color) !important", fontSize: "0.875rem", fontWeight: 500, }}>Select Instance</InputLabel>
                    : ''}
            <Select name="type" label="Select Brand" className="truncate-mobile" onChange={handleBrandChange} value={selectedBrand?._id || ''} disabled={isDisabled}  >
                {
                    brands?.map((brand, index) =>
                        <Option value={brand._id} key={index}>{brand.name}</Option>
                    )
                }
            </Select>
        </Stack>
    )
}

export default BrandsPopover