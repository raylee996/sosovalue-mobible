import Watermark from 'components/operation/Watermark';
const Intro = ({ originalCurrencyDetail }: { originalCurrencyDetail?: API.OriginalCurrencyDetail }) => {
    return (
        <div className="p-3 relative">
            <div className="text-[#E5E5E5] text-sm font-medium mb-4">Intro</div>
            <div className="text-xs text-[#8D8D8D] whitespace-pre-line text-justify" dangerouslySetInnerHTML={{ __html: originalCurrencyDetail?.introduction || '' }}>
            </div>
            <Watermark />
        </div>
    )
}

export default Intro