import { UserButton, auth } from '@clerk/nextjs'
import { MainNav } from '@/components/main-nav'
import StoreSelector from '@/components/store-selector'
import { redirect } from 'next/navigation';
import prismadb from '@/lib/prismadb';

const Navbar = async () => {

    const { userId } = auth();

    if (!userId) {
        redirect('/sign-in');
    }

    const stores = await prismadb.store.findMany({
        where: {
            userId: userId
        },
    });

  return (
    <div className='border-b'>
        <div className='flex h-16 items-center px-4'>
            <StoreSelector items={stores}/>
            <MainNav className='mx-6'>

            </MainNav>
            <div className='ml-auto flex items-center space-x-4'>
                <UserButton afterSignOutUrl='/'/>
            </div>
        </div>
    </div>
  )
}

export default Navbar
