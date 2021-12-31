import { memo } from "react";
interface Props {
  attrs: any;
}
const PlainData: React.FC<Props> = memo(({ attrs, children }) => {
	console.log('plain data', attrs)
	return (
    <div className={`${attrs.classes}`}>
      {children}  
    </div>
  );
});
export default PlainData;