'use client'
import { usePathname, useRouter } from '@/i18n/navigation';
import {useParams} from 'next/navigation';
import { ReactNode, useTransition} from 'react';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import { useLocale } from 'next-intl';

function LocalSwitcherSelect({children, defaultValue}:{children:ReactNode, defaultValue:string}) {

  const currentLocale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();

  function onSelectChange(value: string) {
    const nextLocale = value as "fr"|"en";
    startTransition(() => {
      router.push(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        {pathname, params},
        {locale: nextLocale}
      );
    });
  }
  // Validate the locale to ensure we have a flag image
  const flagSrc = ['fr', 'en'].includes(currentLocale) 
    ? `/flags/${currentLocale}.svg` 
    : '/flags/en.svg';
  return (
    <Select defaultValue={defaultValue} disabled={isPending} onValueChange={onSelectChange}>
    <SelectTrigger className='w-fit inline-flex gap-2 uppercase border-0 bg-transparent'>
        <Image src={flagSrc} width={20} height={20} className='object-cover' alt='flag' /><SelectValue placeholder="Language"/>
    </SelectTrigger>
    <SelectContent className='uppercase'>
        {children}
    </SelectContent>
</Select>
  )
}

export default LocalSwitcherSelect