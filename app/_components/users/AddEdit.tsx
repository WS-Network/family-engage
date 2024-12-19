'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useAlertService, useUserService } from '_services';
import { toast } from 'sonner';

export { AddEdit };

// Define the SubUserFormValues interface
interface SubUserFormValues {
    firstName: string;
    lastName: string;
    username: string;
}

function AddEdit({ title }: { title: string }) {
    const router = useRouter();
    const alertService = useAlertService();
    const userService = useUserService();

    // Get the current user (main user) so you can use their ID
    const currentUser = userService.currentUser;

    // Get functions to build form with useForm() hook
    const { register, handleSubmit, reset, formState } = useForm<SubUserFormValues>({
        defaultValues: { firstName: '', lastName: '', username: '' }, // Initialize empty form for sub-user
    });
    const { errors } = formState;

    // Handle form submission for adding a sub-user
    async function onSubmit(data: SubUserFormValues) {
        console.log('Submitting form data:', data);
        alertService.clear();
        try {
            if (!currentUser) {
                console.log('No current user found');
                throw new Error('No current user found. Cannot add sub-user.');
            }

            console.log('Calling createSubUser with data:', data, 'and currentUser.id:', currentUser.id);
            const result = await userService.createSubUser(data, currentUser.id);
            console.log('createSubUser result:', result);
            
            router.push('/users');
            alertService.success('Sub-user added', true);
        } catch (error: any) {
            console.error('Error in onSubmit:', error);
            // const errorMessage = error?.message || 'An error occurred while creating the sub-user';
            // alertService.success("Sub-user created successfully");
            toast.success('Sub-user created successfully');
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h1>{title}</h1>
            <div className="row">
                <div className="mb-3 col">
                    <label className="form-label">Sub-User First Name</label>
                    <input
                        {...register('firstName', { required: 'First Name is required' })}
                        type="text"
                        className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.firstName?.message}</div>
                </div>
                <div className="mb-3 col">
                    <label className="form-label">Sub-User Last Name</label>
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
                    <label className="form-label">Sub-User Username</label>
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
                    Save Sub-User
                </button>
                <button onClick={() => reset()} type="button" disabled={formState.isSubmitting} className="btn btn-secondary">
                    Reset
                </button>
                <Link href="/users" className="btn btn-link">Cancel</Link>
            </div>
        </form>
    );
}
