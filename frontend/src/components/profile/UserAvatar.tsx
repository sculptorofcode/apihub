import { User } from "@/contexts/auth/auth-types";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link } from "react-router-dom";

export default function UserAvatar({ user, currentUser }: { user: User; currentUser: User }) {
    const getUserInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <Tooltip key={user.id}>
            <TooltipTrigger asChild>
                <Link to={`/profile/${user.username}`} target="_blank" className="inline-block">
                    <div className="relative cursor-pointer hover:scale-110 transition-transform duration-200">
                        <Avatar className="h-7 w-7 ring-2 ring-[var(--primary-50)] dark:ring-[var(--primary-900)] ring-offset-1">
                            <AvatarImage src={typeof user.avatar === 'string' ? user.avatar : undefined} alt={user.name} />
                            <AvatarFallback className="text-xs bg-gradient-to-br from-[var(--primary-400)] to-[var(--primary-600)] text-white">
                                {user.id === currentUser.id ? "You" : getUserInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </Link>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs font-medium bg-[var(--primary-50)] text-[var(--primary-900)] dark:bg-[var(--primary-900)] dark:text-[var(--primary-50)] border-[var(--primary-200)]">
                {user.id === currentUser.id ? "You" : user.name}
            </TooltipContent>
        </Tooltip>
    );
}