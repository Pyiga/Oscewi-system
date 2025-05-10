import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome to Oscewi">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC] px-4 sm:px-6 lg:px-8">

                {/* NAVIGATION */}
                <header className="absolute top-6 right-6">
                    <nav className="flex items-center gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="rounded-md border border-[#ccc] bg-white px-4 py-2 text-sm font-medium hover:bg-[#f5f5f5] dark:bg-[#191400] dark:border-[#444] dark:hover:bg-[#2a2a2a]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700"
                                >
                                    Log in
                                </Link>

                            </>
                        )}
                    </nav>
                </header>

                {/* MAIN WELCOME SECTION */}
                <main className="max-w-4xl w-full flex flex-col-reverse lg:flex-row items-center gap-10 py-20 lg:py-32">
                    <div className="w-full lg:w-1/2 bg-white dark:bg-[#191400] rounded-xl shadow-lg p-8 lg:p-10 border border-[#e0e0e0] dark:border-[#333] text-center lg:text-left">
                        <h1 className="text-3xl font-bold text-[#008080] dark:text-[#EDEDEC] mb-4">
                            Welcome to Oscewi
                        </h1>
                        <p className="text-base text-[#555] dark:text-[#ccc]">
                            Oscewi is a platform designed to support young children living with Sickle Cell Disease.
                            Together, we make care accessible and compassionate.
                        </p>
                    </div>
                    <div className="w-full lg:w-1/2 flex justify-center">
                        <img
                            src="/images/rr.jpeg"
                            alt="Welcome Illustration"
                            className="w-72 lg:w-96"
                        />
                    </div>
                </main>

                {/* INFO CARDS SECTION */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl w-full pb-16">
                    {/* Card 1 */}
                    <div className="bg-white dark:bg-[#191400] border border-[#e5e7eb] dark:border-[#333] rounded-xl shadow-md overflow-hidden">
                        <img
                            src="/images/ee.jpeg"
                            alt="Sickle Cell Awareness"
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-[#008080] dark:text-white mb-2">
                                What is Sickle Cell Disease?
                            </h2>
                            <p className="text-sm text-[#444] dark:text-[#ccc]">
                                Sickle Cell is a genetic blood disorder affecting red blood cells. Early detection and support can greatly improve quality of life for young patients.
                            </p>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white dark:bg-[#191400] border border-[#e5e7eb] dark:border-[#333] rounded-xl shadow-md overflow-hidden">
                        <img
                            src="/images/yut.jpeg"  // Corrected image path
                            alt="Child Support and Clinic"
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-[#008080] dark:text-white mb-2">
                                How Oscewi Helps
                            </h2>
                            <p className="text-sm text-[#444] dark:text-[#ccc]">
                                We register, track, and support children with Sickle Cell Disease, ensuring they receive proper care, medical follow-up, and community aid.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
