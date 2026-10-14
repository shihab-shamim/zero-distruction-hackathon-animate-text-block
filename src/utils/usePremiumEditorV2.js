import { useEffect } from 'react';
import { useWPAjax } from '../../../bpl-tools/hooks';


const usePremiumInEditorV2 = (pipeAction) => {
    const { data = null, refetch, isLoading = true } = useWPAjax(pipeAction, { _wpnonce: window.wpApiSettings?.nonce }, true);
    const isPremium = (!isLoading && data?.isPipe) || false;

    useEffect(() => {
        refetch();
    }, []);

    return { isPremium, isLoading };
};
export default usePremiumInEditorV2;