"use client"

interface FollowerCountProps {
    userId : string,
    initialState : FollowerInfo
}

import useFollowerInfo from "@/hooks/useFollowerInfo";
import { FollowerInfo } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

export default function FollowerCount({
    userId,
    initialState
} : FollowerCountProps) {
    const {data} = useFollowerInfo(userId, initialState)

    return (
        <span>
            Followers : {formatNumber(data.followers)}
        </span>
    );
}