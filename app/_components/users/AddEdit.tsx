'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useAlertService, useUserService } from '_services';

export { AddEdit };

// Define the SubUserFormValues interface
interface SubUserFormValues {
    firstName: string;
    lastName: string;
    username: string;
}

// Add the IUser interface to represent the 'user' object
interface IUser {
    id: string;          // Add this line to include 'id' in the IUser interface
    firstName: string;
    lastName: string;
    username: string;
}

function AddEdit({ title, user }: { title: string, user?: IUser }) {
    const router = useRouter();
    const alertService = useAlertService();
    const userService = useUserService();

    // Get functions to build form with useForm() hook
    const { register, handleSubmit, reset, formState } = useForm<SubUserFormValues>({
        defaultValues: user || { firstName: '', lastName: '', username: '' }, // Use user prop for default values or empty form
    });
    const { errors } = formState;

    // Handle form submission for adding/editing a user
    async function onSubmit(data: SubUserFormValues) {
        alertService.clear();
        try {
            const currentUser = await userService.getCurrent();  // Fetch current user to get userId

            if (!currentUser || !currentUser.id) {
                throw new Error('Main user ID not found');
            }

            if (user) {
                // Update user if user is provided (edit mode)
                await userService.update(user.id, data);  // Now 'user.id' exists in IUser
                alertService.success('User updated successfully', true);
            } else {
                // Create sub-user with userId and subUserData (add mode)
                await userService.createSubUser(currentUser.id, data); // Pass both userId and subUserData
                alertService.success('Sub-user added', true);
            }

            // Redirect to user list
            router.push('/users');
        } catch (error: any) {
            const errorMessage = error?.message || 'An error occurred';
            alertService.error(errorMessage);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h1>{title}</h1>
            <div className="row">
                <div className="mb-3 col">
                    <label className="form-label">First Name</label>
                    <input
                        {...register('firstName', { required: 'First Name is required' })}
                        type="text"
                        className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.firstName?.message}</div>
                </div>
                <div className="mb-3 col">
                    <label className="form-label">Last Name</label>
                    <input
                        {...register('lastName', { required: 'Last Name is required' })}
                        type="text"
                        className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.lastName?.message}</div>
                </div>
            </div>
            <div className="row">
                <div className="mb-3 col">
                    <label className="form-label">Username</label>
                    <input
                        {...register('username', { required: 'Username is required' })}
                        type="text"
                        className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.username?.message}</div>
                </div>
            </div>

            <div className="mb-3">
                <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary me-2">
                    {formState.isSubmitting && <span className="spinner-border spinner-border-sm me-1"></span>}
                    Save
                </button>
                <button onClick={() => reset()} type="button" disabled={formState.isSubmitting} className="btn btn-secondary">
                    Reset
                </button>
                <Link href="/users" className="btn btn-link">Cancel</Link>
            </div>
        </form>
    );
}
