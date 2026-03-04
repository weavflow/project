export type OptionProps = {
    option: string;
    selected: boolean;
    disabled?: boolean;
    onSelect: () => void;
}