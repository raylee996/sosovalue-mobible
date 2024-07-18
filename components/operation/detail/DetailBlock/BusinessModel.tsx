const Intro = ({ originalCurrencyDetail }: { originalCurrencyDetail?: API.OriginalCurrencyDetail }) => {
    return (
        <div className="p-3">
            <div className="text-[#E5E5E5] text-sm font-medium mb-4">Token Allocation</div>
            <div className="text-xs text-[#8D8D8D] whitespace-pre-line text-justify" dangerouslySetInnerHTML={{ __html: originalCurrencyDetail?.tokenModel || '' }}>
            </div>
        </div>
    )

}

export default Intro