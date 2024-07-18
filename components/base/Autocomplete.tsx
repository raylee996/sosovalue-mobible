import React, { PropsWithChildren } from 'react'
import TextField from '@mui/material/TextField';
import Autocomplete, { AutocompleteProps, autocompleteClasses } from '@mui/material/Autocomplete';
import useMediaQuery from '@mui/material/useMediaQuery';
import ListSubheader from '@mui/material/ListSubheader';
import Popper from '@mui/material/Popper';
import { useTheme, styled } from '@mui/material/styles';
import { VariableSizeList, ListChildComponentProps } from 'react-window';
import Typography from '@mui/material/Typography';
import { useDebounce } from 'ahooks';
type Props<T> = PropsWithChildren<{
  label: string;
  required?: boolean;
  helperText?: React.ReactNode;
  request?: (text: string) => Promise<{ value: string; label: string; }[]>;
} & AutocompleteProps<T, false, false, false>>
const LISTBOX_PADDING = 8; // px

function renderRow(props: ListChildComponentProps) {
  const { data, index, style } = props;
  const dataSet = data[index];
  const inlineStyle = {
    ...style,
    top: (style.top as number) + LISTBOX_PADDING,
  };

  if (dataSet.hasOwnProperty('group')) {
    return (
      <ListSubheader key={dataSet.key} component="div" style={inlineStyle}>
        {dataSet.group}
      </ListSubheader>
    );
  }

  return (
    <Typography {...dataSet[0]} noWrap style={inlineStyle}>
      {dataSet}
    </Typography>
  );
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef<HTMLDivElement>((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps}/>;
});
OuterElementType.displayName = 'OuterElementType'
function useResetCache(data: any) {
  const ref = React.useRef<VariableSizeList>(null);
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

// Adapter for react-window
const ListboxComponent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLElement>
>(function ListboxComponent(props, ref) {
  const { children, ...other } = props;
  const itemData: React.ReactElement[] = [];
  (children as React.ReactElement[]).forEach(
    (item: React.ReactElement & { children?: React.ReactElement[] }) => {
      itemData.push(item);
      itemData.push(...(item.children || []));
    },
  );

  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'), {
    noSsr: true,
  });
  const itemCount = itemData.length;
  const itemSize = smUp ? 36 : 48;

  const getChildSize = (child: React.ReactElement) => {
    if (child.hasOwnProperty('group')) {
      return 48;
    }

    return itemSize;
  };

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * itemSize;
    }
    return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
  };

  const gridRef = useResetCache(itemCount);

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={(index:number) => getChildSize(itemData[index])}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});



const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    background:'#0D0D0D',
    boxShadow: '0px 0px 8px 0px rgba(0, 0, 0, 0.36)',
    boxSizing: 'border-box',
    borderRadius:'4px',
    '& ul': {
      padding: 0,
      margin: 0,
     
    },
  },
});



function FormSelect<T>({ value, label, helperText, fullWidth, request, required, ...props }: Props<T>) {
    const [text, setText] = React.useState<string>('');
    
    const debouncedText = useDebounce(text, { wait: 500 });

    const onInputChange = (event: React.SyntheticEvent, value: string,) => {
      setText(value)
    }
    React.useEffect(() => {
      debouncedText && request && request(text)
    }, [debouncedText])
    return (

      <Autocomplete
        disablePortal
        disableListWrap
        PopperComponent={StyledPopper}
        ListboxComponent={ListboxComponent}
        size="small"
        value={value || null}
        onInputChange={onInputChange}
        
        {...props}
      />
       
    
    )
};
  
export default FormSelect; 