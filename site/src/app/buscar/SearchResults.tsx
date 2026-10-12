"use client";
import { useSearchParams } from "next/navigation";
import SearchBox from "@/components/SearchBox";
export default function SearchResults(){const params=useSearchParams(); const query=params.get("q")||"";return <SearchBox key={query} initialQuery={query} full/>;}
