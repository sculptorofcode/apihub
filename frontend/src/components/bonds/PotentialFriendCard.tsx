import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserPlus, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { User } from "@/contexts/auth/auth-types";

interface PotentialFriendCardProps {
    user: User;
    onSendRequest: (id: string, name: string) => void;
    isRequestSent: boolean;
}

const PotentialFriendCard: React.FC<PotentialFriendCardProps> = ({
    user,
    onSendRequest,
    isRequestSent,
}) => {
    const navigate = useNavigate(); const handleViewProfile = () => {
        if (user.username) {
            navigate(`/profile/${user.username}`);
        }
    };

    return (
        <Card className="hover:shadow-md transition-shadow bg-[var(--background-50)] dark:bg-[var(--background-800)]">
            <CardContent className="p-3 sm:p-4">
                <div className="flex items-start space-x-3 sm:space-x-4">
                    <div
                        className="cursor-pointer"
                        onClick={handleViewProfile}
                        onKeyDown={(e) => e.key === 'Enter' && handleViewProfile()}
                        tabIndex={0}
                    >
                        <Avatar className="h-12 w-12 sm:h-14 sm:w-14">                            <AvatarImage
                            src={typeof user.avatar === "string" ? user.avatar : undefined}
                            alt={user.name || "User"}
                        />
                            <AvatarFallback className="bg-[var(--secondary-300)] text-[var(--text-900)]">
                                {user.name && user.name.length > 0
                                    ? user.name.split(" ").map((n) => n[0]).join("")
                                    : user.username
                                        ? user.username.substring(0, 2).toUpperCase()
                                        : "U"}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    <div className="flex-1 min-w-0">
                        <div
                            className="cursor-pointer"
                            onClick={handleViewProfile}
                            onKeyDown={(e) => e.key === 'Enter' && handleViewProfile()}
                            tabIndex={0}
                        >                            <h3 className="font-semibold text-[var(--text-900)] dark:text-[var(--text-50)] truncate text-sm sm:text-base hover:underline">
                                {user.name || "User"}
                            </h3>
                            <p className="text-xs sm:text-sm text-[var(--text-600)] dark:text-[var(--text-400)] truncate">
                                @{user.username || "user"}
                            </p>
                        </div>                        {user.bio && (
                            <p className="text-xs line-clamp-1 sm:line-clamp-2 my-1 text-[var(--text-700)] dark:text-[var(--text-300)]">
                                {user.bio}
                            </p>
                        )}
                        <div className="flex flex-wrap items-center mt-1 gap-2">
                            {user.bio && (
                                <Badge variant="secondary" className="text-xs">
                                    Has bio
                                </Badge>
                            )}
                        </div>

                        {/* Mobile button */}                        <div className="mt-2 sm:hidden">
                            <Button
                                size="sm"
                                variant={isRequestSent ? "outline" : "default"}
                                className={
                                    isRequestSent
                                        ? "w-full bg-[var(--background-100)] hover:bg-[var(--background-200)]"
                                        : "w-full bg-[var(--primary-500)] hover:bg-[var(--primary-600)]"
                                }
                                onClick={() => !isRequestSent && onSendRequest(
                                    user.id ? user.id.toString() : '',
                                    user.name || 'User'
                                )}
                                disabled={isRequestSent}
                            >
                                {isRequestSent ? (
                                    <>
                                        <Check className="h-4 w-4 mr-1 text-green-500" />
                                        Request Sent
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="h-4 w-4 mr-1" />
                                        Add Friend
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>                    {/* Desktop button */}
                    <div className="hidden sm:block flex-shrink-0">
                        <Button
                            size="sm"
                            variant={isRequestSent ? "outline" : "default"}
                            className={
                                isRequestSent
                                    ? "bg-[var(--background-100)] hover:bg-[var(--background-200)]"
                                    : "bg-[var(--primary-500)] hover:bg-[var(--primary-600)]"
                            }
                            onClick={() => !isRequestSent && onSendRequest(
                                user.id ? user.id.toString() : '',
                                user.name || 'User'
                            )}
                            disabled={isRequestSent}
                        >
                            {isRequestSent ? (
                                <>
                                    <Check className="h-4 w-4 mr-1 text-green-500" />
                                    Request Sent
                                </>
                            ) : (
                                <>
                                    <UserPlus className="h-4 w-4 mr-1" />
                                    Add Friend
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PotentialFriendCard;
