import { create } from 'zustand';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAlertService } from '_services';
import { useFetch } from '_helpers/client';
import { Toaster, toast } from 'sonner'
export { useUserService };

// Define SubUser interface
interface SubUser {
    username: string;
    firstName: string;
    lastName: string;
}

// user state store
const initialState = {
    users: undefined,
    user: undefined,
    currentUser: undefined,
};

const userStore = create<IUserStore>(() => initialState);

function useUserService(): IUserService {
    const alertService = useAlertService();
    const fetch = useFetch();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { users, user, currentUser } = userStore();

    return {
        users,
        user,
        currentUser,

        login: async (username, password) => {
            alertService.clear();
            try {
                const currentUser = await fetch.post('/api/account/login', { username, password });
                userStore.setState({ ...initialState, currentUser });
                const returnUrl = searchParams.get('returnUrl') || '/';
                router.push(returnUrl);
            } catch (error: any) {
                alertService.error(error.message);
            }
        },

        logout: async () => {
            await fetch.post('/api/account/logout');
            router.push('/account/login');
        },

        register: async (user) => {
            try {
                await fetch.post('/api/account/register', user);
                // alertService.success('Registration successful', true);
                toast.success('Registration successful, go back to login');
                router.push('/account/login');
            } catch (error: any) {
                alertService.error(error.message);
            }
        },

        getAll: async () => {
            try {
                const fetchedUsers = await fetch.get('/api/users');
                userStore.setState({ users: fetchedUsers });
                return fetchedUsers;
            } catch (error: any) {
                alertService.error(error.message);
                return [];
            }
        },

        getById: async (id) => {
            userStore.setState({ user: undefined });
            try {
                const fetchedUser = await fetch.get(`/api/users/${id}`);
                userStore.setState({ user: fetchedUser });
            } catch (error: any) {
                alertService.error(error.message);
            }
        },

        getCurrent: async () => {
            try {
                if (!currentUser) {
                    const fetchedUser: IUser = await fetch.get('/api/users/current');
                    userStore.setState({ currentUser: fetchedUser });
                    return fetchedUser;
                }
                return currentUser;
            } catch (error: any) {
                alertService.error('Unable to fetch current user.');
                return null;
            }
        },

        getSubUsers: async (userId: string) => {
            try {
                const subUsers = await fetch.get('/api/subusers', {
                    headers: {
                        'userId': userId,
                        'Content-Type': 'application/json',
                    },
                });
                return subUsers;
            } catch (error: any) {
                throw new Error(error.message || 'Failed to fetch sub-users');
            }
        },

        create: async (user) => {
            try {
                await fetch.post('/api/users', user);
                alertService.success('User created successfully');
            } catch (error: any) {
                alertService.error(error.message);
            }
        },

        update: async (id, params) => {
            try {
                await fetch.put(`/api/users/${id}`, params);
                if (id === currentUser?.id) {
                    userStore.setState({ currentUser: { ...currentUser, ...params } });
                }
                alertService.success('User updated successfully');
            } catch (error: any) {
                alertService.error(error.message);
            }
        },

        delete: async (id) => {
            try {
                userStore.setState({
                    users: users?.map((x) => {
                        if (x.id === id) {
                            x.isDeleting = true;
                        }
                        return x;
                    }),
                });

                const response = await fetch.delete(`/api/users/${id}`);
                userStore.setState({ users: users?.filter((x) => x.id !== id) });

                if (response.deletedSelf) {
                    router.push('/account/login');
                }
                alertService.success('User deleted successfully');
            } catch (error: any) {
                alertService.error(error.message);
            }
        },

        createSubUser: async (subUser: SubUser, userId: string) => {
            try {
                const response = await fetch.post('/api/users/subusers', {
                    username: subUser.username,
                    firstName: subUser.firstName,
                    lastName: subUser.lastName,
                    userId,
                });

                if (!response.ok) {
                    throw new Error(`Failed to create sub-user: ${response.statusText}`);
                }

                alertService.success('Sub-user created successfully');
            } catch (error: any) {
                alertService.success('Sub-user created successfully');
                throw error;
            }
        },

        addFriend: async (friendId: string) => {
            try {
                const userId = currentUser?.id || (await fetch.get('/api/users/current')).id;
                if (!userId) {
                    throw new Error('No current user found');
                }

                await fetch.post('/api/users/friends', {
                    userId,
                    friendId
                });

                alertService.success('Family member added successfully');
            } catch (error: any) {
                alertService.error(error.message || 'Failed to add family member');
                throw error;
            }
        },

        removeFriend: async (friendId: string) => {
            try {
                const userId = currentUser?.id || (await fetch.get('/api/users/current')).id;
                if (!userId) {
                    throw new Error('No current user found');
                }

                await fetch.delete('/api/users/friends', {
                    body: JSON.stringify({
                        userId,
                        friendId
                    })
                });

                alertService.success('Family member removed successfully');
            } catch (error: any) {
                alertService.error(error.message || 'Failed to remove family member');
                throw error;
            }
        },

        getFriends: async () => {
            try {
                const userId = currentUser?.id || (await fetch.get('/api/users/current')).id;
                if (!userId) {
                    throw new Error('No current user found');
                }

                const response = await fetch.get('/api/users/friends', {
                    headers: {
                        'userId': userId
                    }
                });

                return response;
            } catch (error: any) {
                alertService.error(error.message || 'Failed to fetch family members');
                throw error;
            }
        }
    };
}

interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    isDeleting?: boolean;
    subUsers: SubUser[];
}

interface IUserStore {
    users?: IUser[];
    user?: IUser;
    currentUser?: IUser;
}

interface IUserService extends IUserStore {
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (user: IUser) => Promise<void>;
    getAll: () => Promise<any>;
    getById: (id: string) => Promise<void>;
    getCurrent: () => Promise<IUser | null>;
    create: (user: IUser) => Promise<void>;
    update: (id: string, params: Partial<IUser>) => Promise<void>;
    delete: (id: string) => Promise<void>;
    createSubUser: (subUser: SubUser, userId: string) => Promise<void>;
    getSubUsers: (userId: string) => Promise<SubUser[]>;
    addFriend: (friendId: string) => Promise<void>;
    removeFriend: (friendId: string) => Promise<void>;
    getFriends: () => Promise<any>;
}