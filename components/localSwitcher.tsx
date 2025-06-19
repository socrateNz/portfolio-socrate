import { useLocale } from 'next-intl'
import React from 'react'
import { routing } from '@/i18n/routing';
import { SelectItem } from '@/components/ui/select';
import LocaleSwitcherSelect from '@/components/localSwitcherSelect';

function LocalSwitcher() {
    const locale = useLocale();
  return (
    <LocaleSwitcherSelect defaultValue={locale}>
        {
            routing.locales.map((lang, index)=>
                <SelectItem value={lang} key={index}>{lang}</SelectItem>)
        }
        
    </LocaleSwitcherSelect>
  )
}

export default LocalSwitcher