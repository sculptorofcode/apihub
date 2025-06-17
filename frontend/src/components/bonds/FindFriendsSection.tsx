import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, UserPlus, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import PotentialFriendCard from "./PotentialFriendCard";
import { User } from "@/contexts/auth/auth-types";
import { useDebounce } from "@/hooks/useDebounce";


interface PaginationData {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
}

interface FindFriendsSectionProps {
    users: User[];
    currentUserId: string;
    sentRequests: string[];
    onSendRequest: (userId: string, name: string) => void;
    onSearch: (query: string, page: number, suggested: boolean) => void;
    isLoading?: boolean;
    pagination?: PaginationData;
}

const FindFriendsSection: React.FC<FindFriendsSectionProps> = ({
    users,
    currentUserId,
    sentRequests,
    onSendRequest,
    onSearch,
    isLoading = false,
    pagination = {
        total: 0,
        per_page: 10,
        current_page: 1,
        last_page: 1,
        from: 0,
        to: 0
    }
}) => {
    const [findSearchQuery, setFindSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("suggested");
    const debouncedSearchQuery = useDebounce(findSearchQuery, 500); // 500ms debounce delay
    const initialSearchDone = useRef(false);
    const [currentPage, setCurrentPage] = useState(1);

    // Filter out current user, already friends, and sent requests
    const filteredUsers = users.filter((user) =>
        user.id.toString() !== currentUserId &&
        !sentRequests.includes(user.id.toString()) &&
        !user.isFriend
    );

    // Effect to handle debounced search
    useEffect(() => {
        if (debouncedSearchQuery.length >= 2) {
            onSearch(debouncedSearchQuery, currentPage, activeTab === "suggested");
            initialSearchDone.current = true;
        }
        else if (debouncedSearchQuery === "" && initialSearchDone.current) {
            onSearch("", currentPage, activeTab === "suggested");
        }
    }, [debouncedSearchQuery]);

    // Effect to handle tab change
    useEffect(() => {
        setCurrentPage(1);
        onSearch(debouncedSearchQuery, 1, activeTab === "suggested");
    }, [activeTab]);

    // Handle search input change - just update the local state
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFindSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    // Handle pagination
    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= pagination.last_page) {
            setCurrentPage(newPage);
            onSearch(debouncedSearchQuery, newPage, activeTab === "suggested");
        }
    };

    // Determine which users to display
    const usersToDisplay = filteredUsers;

    return (
        <section className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-900)] dark:text-[var(--text-50)]">
                    Find Friends
                </h2>
            </div>

            <Card>
                <CardContent className="p-4">
                    <Tabs defaultValue="suggested" onValueChange={setActiveTab} className="w-full">
                        <div className="flex items-center justify-between mb-4">
                            <TabsList>
                                <TabsTrigger value="suggested">Suggested</TabsTrigger>
                                <TabsTrigger value="browse">Browse All</TabsTrigger>
                            </TabsList>
                            <div className="relative w-full max-w-[250px]">
                                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                                <Input
                                    placeholder="Search people..."
                                    value={findSearchQuery}
                                    onChange={handleSearchChange}
                                    className="pl-8 h-9 text-sm"
                                />
                            </div>
                        </div>
                        <TabsContent value="suggested" className="m-0">
                            {showUsersList(usersToDisplay, findSearchQuery, onSendRequest, sentRequests, "suggested", isLoading)}

                            {/* Pagination for suggested tab */}
                            {!isLoading && users.length > 0 && (
                                <div className="flex items-center justify-between pt-4 border-t border-[var(--border)] mt-4">
                                    <div className="text-sm text-[var(--text-600)] dark:text-[var(--text-400)]">
                                        {pagination.from}-{pagination.to} of {pagination.total}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1 || isLoading}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <span className="text-sm font-medium">Page {currentPage}</span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === pagination.last_page || isLoading}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="browse" className="m-0">
                            {showUsersList(usersToDisplay, findSearchQuery, onSendRequest, sentRequests, "browse", isLoading)}

                            {/* Pagination for browse tab */}
                            {!isLoading && users.length > 0 && (
                                <div className="flex items-center justify-between pt-4 border-t border-[var(--border)] mt-4">
                                    <div className="text-sm text-[var(--text-600)] dark:text-[var(--text-400)]">
                                        {pagination.from}-{pagination.to} of {pagination.total}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1 || isLoading}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <span className="text-sm font-medium">Page {currentPage}</span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === pagination.last_page || isLoading}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </section>
    );
};

// Helper function to show users list or empty state
const showUsersList = (
    users: User[],
    searchQuery: string,
    onSendRequest: (id: string, name: string) => void,
    sentRequests: string[],
    tabType: string,
    isLoading = false
) => {
    if (isLoading) {
        return (
            <div className="p-6 text-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-10 w-10 bg-[var(--text-200)] dark:bg-[var(--text-700)] rounded-full mb-3"></div>
                    <div className="h-4 w-32 bg-[var(--text-200)] dark:bg-[var(--text-700)] rounded mb-2"></div>
                    <div className="h-2 w-48 bg-[var(--text-200)] dark:bg-[var(--text-700)] rounded"></div>
                </div>
            </div>
        );
    } else if (users.length > 0) {
        return (
            <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                    {users.map((user) => (
                        <PotentialFriendCard
                            key={user.id}
                            user={user}
                            onSendRequest={onSendRequest}
                            isRequestSent={user.isRequestSent || sentRequests.includes(user.id.toString())}
                        />
                    ))}
                </div>
            </ScrollArea>
        );
    } else {
        return (
            <div className="p-6 text-center">
                {searchQuery ? (
                    <>
                        <AlertCircle className="h-10 w-10 mx-auto mb-3 text-[var(--text-400)]" />
                        <h3 className="text-lg font-semibold text-[var(--text-900)] dark:text-[var(--text-50)] mb-2">
                            No matching users
                        </h3>
                        <p className="text-sm text-[var(--text-600)] dark:text-[var(--text-400)]">
                            Try a different search term.
                        </p>
                    </>
                ) : (
                    <>
                        <UserPlus className="h-10 w-10 mx-auto mb-3 text-[var(--text-400)]" />
                        <h3 className="text-lg font-semibold text-[var(--text-900)] dark:text-[var(--text-50)] mb-2">
                            {tabType === "suggested" ? "No suggestions available" : "No users available"}
                        </h3>
                        <p className="text-sm text-[var(--text-600)] dark:text-[var(--text-400)]">
                            {tabType === "suggested"
                                ? "We'll suggest potential connections once your network grows."
                                : "Check back later for new members to connect with."}
                        </p>
                    </>
                )}
            </div>
        );
    }
};

export default FindFriendsSection;
