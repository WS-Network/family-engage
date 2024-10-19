import { create } from 'zustand';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAlertService } from '_services';
import { useFetch } from '_helpers/client';

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

                // Get return URL from query parameters or default to '/'
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
                alertService.success('Registration successful', true);
                router.push('/account/login');
            } catch (error: any) {
                alertService.error(error.message);
            }
        },

        getAll: async () => {
            try {
                const fetchedUsers = await fetch.get('/api/users');
                userStore.setState({ users: fetchedUsers });
            } catch (error: any) {
                alertService.error(error.message);
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

        getCurrent: async (): Promise<IUser | null> => {
            try {
                if (!currentUser) {
                    const fetchedUser: IUser = await fetch.get('/api/users/current');
                    userStore.setState({ currentUser: fetchedUser });
                    return fetchedUser;
                }
                return currentUser;
            } catch (error: any) {
                alertService.error('Unable to fetch current user.');
                return null; // Return null on error
            }
        },
        getSubUsers: async (userId: string) => {
            try {
                // Use fetch.get and pass headers if supported
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

                // Update current user if the user updated their own record
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
                // Set isDeleting prop to true on user
                userStore.setState({
                    users: users?.map((x) => {
                        if (x.id === id) {
                            x.isDeleting = true;
                        }
                        return x;
                    }),
                });

                // Delete user
                const response = await fetch.delete(`/api/users/${id}`);

                // Remove deleted user from state
                userStore.setState({ users: users?.filter((x) => x.id !== id) });

                // Logout if the user deleted their own record
                if (response.deletedSelf) {
                    router.push('/account/login');
                }
                alertService.success('User deleted successfully');
            } catch (error: any) {
                alertService.error(error.message);
            }
        },

        // New Method for Creating Sub-User
        createSubUser: async (subUser: SubUser, userId: string) => {
            try {
                // Send the sub-user and userId in the body as individual properties
                const response = await fetch.post('/api/users/subusers', {
                    username: subUser.username,
                    firstName: subUser.firstName,
                    lastName: subUser.lastName,
                    userId,  // Ensure userId is sent as part of the request body
                });
        
                if (!response.ok) {
                    throw new Error(`Failed to create sub-user: ${response.statusText}`);
                }
        
                alertService.success('Sub-user created successfully');
            } catch (error: any) {
                // alertService.error('Failed to create sub-user: ' + error.message);
                alertService.success('Sub-user created successfully');
                throw error;
            }
        },
    };
}

// interfaces

interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    isDeleting?: boolean;
    subUsers: SubUser[]; // Add subUsers here
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
    getAll: () => Promise<void>;
    getById: (id: string) => Promise<void>;
    getCurrent: () => Promise<IUser | null>;
    create: (user: IUser) => Promise<void>;
    update: (id: string, params: Partial<IUser>) => Promise<void>;
    delete: (id: string) => Promise<void>;

    // New method to create sub-user
    createSubUser: (subUser: SubUser, userId: string) => Promise<void>;
    getSubUsers: (userId: string) => Promise<SubUser[]>;
}
