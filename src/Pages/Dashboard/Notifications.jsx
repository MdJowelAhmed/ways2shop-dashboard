import React, { useState, useEffect } from 'react';
import { ConfigProvider, Pagination, Spin } from 'antd';
import { useGetNotificationsQuery, useReadNotificationMutation } from "../../redux/apiSlices/notificationSlice";
import { useProfileQuery } from "../../redux/apiSlices/authSlice";
import toast from 'react-hot-toast';
// import socketService from '../../services/socketService';
import { getImageUrl } from "../../components/common/imageUrl";
import socketService from '../../components/common/socketService';
import notificationImg from "../../assets/notification.png";

const Notifications = () => {
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    
    const { data: userData } = useProfileQuery();
    const { data: notificationsData, isLoading, refetch } = useGetNotificationsQuery([
        { name: 'page', value: page },
        { name: 'limit', value: limit }
    ]);
    
    const [readNotification] = useReadNotificationMutation();

    // Socket connection setup
    useEffect(() => {
        if (userData?.data?._id) {
            socketService.connect(userData.data._id);

            const notificationEvent = `get-notification::${userData.data._id}`;
            
            const handleNewNotification = (data) => {
                console.log("New notification received:", data);
                // toast.success(data.title || "New notification received");
                refetch();
            };

            socketService.on(notificationEvent, handleNewNotification);

            return () => {
                socketService.off(notificationEvent, handleNewNotification);
            };
        }
    }, [userData?.data?._id, refetch]);

    const handleReadAll = async () => {
        try {
            const response = await readNotification().unwrap();
            if (response.status || response.success) {
                toast.success(response.message || "All notifications marked as read");
                refetch();
            }
        } catch (error) {
            toast.error(error?.data?.message || "Failed to mark notifications as read");
        }
    };

    const notifications = notificationsData?.data?.notifications || [];
    const pagination = notificationsData?.pagination || {};
    const unreadCount = notificationsData?.data?.unreadCount || 0;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div>
            <div className='flex items-center justify-between mb-6'>
                <h2 className='text-[22px]'>
                    All Notifications 
                    {unreadCount > 0 && (
                        <span className='ml-2 text-sm bg-red-500 text-white px-2 py-1 rounded-full'>
                            {unreadCount} unread
                        </span>
                    )}
                </h2>
                {notifications.length > 0 && (
                    <button 
                        onClick={handleReadAll}
                        className='bg-primary text-white h-10 px-4 rounded-md hover:opacity-90 transition-opacity'
                    >
                        Read All
                    </button>
                )}
            </div>

            {notifications.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    No notifications found
                </div>
            ) : (
                <div className='grid grid-cols-1 gap-5'>
                    {notifications.map((notification) => (
                        <div 
                            key={notification._id} 
                            className={`border-b-[1px] pb-2 border-[#d9d9d9] flex items-start gap-3 ${
                                !notification.isRead ? 'bg-blue-50 p-3 rounded-md' : ''
                            }`}
                        >
                            <div className='relative'>
                                <img 
                                    style={{
                                        height: "40px",
                                        width: "40px",
                                        // borderRadius: "100%",
                                        // border: "2px solid gray",
                                        objectFit: "cover"
                                    }} 
                                    src={notificationImg}
                                    alt="notification"
                                />
                                {!notification.isRead && (
                                    <span className='absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-white'></span>
                                )}
                            </div>
                            <div className='flex-1'>
                                <p className='font-medium'>{notification.title}</p>
                                {/* <p className='text-gray-700 mt-1'>{notification.message}</p> */}
                                <p style={{ color: "gray",  fontSize: "14px" }}>
                                    {notification.timeAgo}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {pagination.totalPage > 1 && (
                <div className='flex items-center justify-center mt-6'>
                    <ConfigProvider
                        theme={{
                            components: {
                                Pagination: {
                                    itemActiveBg: "#CDA861",
                                    borderRadius: "100%"
                                }
                            },
                            token: {
                                colorPrimary: "white"
                            }
                        }}
                    >
                        <Pagination 
                            current={page} 
                            total={pagination.total} 
                            pageSize={pagination.limit}
                            onChange={(newPage) => setPage(newPage)} 
                            showQuickJumper={false} 
                            showSizeChanger={false}
                        />
                    </ConfigProvider>
                </div>
            )}
        </div>
    );
};

export default Notifications;