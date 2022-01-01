/* TODO fix type */
// @ts-ignore
// @ts-nocheck
import { useMutation } from '@apollo/client';
import { FiGrid } from "react-icons/fi";
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/router";
import { useBlocks } from "store/blocksStore";
import { CREATE_BLOCK } from "components/blocks/gql/composer"
interface Props {
  type: string;
}

export const DataBlocks: React.FC = ({type}) => {

  /* Zustand states */
  const selectedBlockId = useBlocks((state) => state.selectedBlockId);
  const blocks = useBlocks((state) => state.blocks);
  const block = () => blocks.find((x) => x.id === selectedBlockId);
  const addBlock = useBlocks((state) => state.addBlock);
  const setBlock = useBlocks((state) => state.setBlock);
  
  /* local consts */
  const router = useRouter()
  const slugPath = router.query?.slugPath || ["Page", "home"];
  const prefix = {
    id: uuidv4(),
    post: slugPath[1],
    order: parseInt(blocks[blocks.length - 1].order) + 1,
    parentId: type === "next" 
      ? block()?.parentId === 0 ? "0" : block()?.parentId 
      : block()?.id,
  };
  const buttonClass =
    "text-sm bg-green-500 w-full p-2 rounded mt-1 text-white hover:bg-green-800 flex items-center";  
 
  /* mutation */
  const [addNewBlock, { data, loading, error }] = useMutation(CREATE_BLOCK, {
    onCompleted(data) {
        const payload = Object.assign({},data.createBlock) 
        payload.parentId === "0" ? payload.parentId = 0 : null
        addBlock(payload);
        /* set block to active */
        setBlock(payload.id);
        useBlocks.setState({ panel: "block", composerTab: null });
    }, 
    update: (cache) => {
      cache.evict({ id: "ROOT_QUERY", fieldName: "getBlocks" });
    }, 
  });
  const teachSetBlock = (block) => {
    /* Set to zustand state */
    addNewBlock({ variables: {input:block}});
  }

  return (
    <div className="px-2">
      <button
        className={buttonClass}
        onClick={(e) =>
          teachSetBlock({
            ...prefix,
            block: "data/Query",
            attrs: {
              refName: prefix.id,
              query: "",
              variables: {},
              childrenSlots: [],
              classes: ""
            },
          })
        }
      >
        Query
      </button>

     


      <button
        className={buttonClass}
        onClick={(e) =>
          teachSetBlock({
            ...prefix,
            block: "data/PlainData",
            attrs: {
              classes: ""
            },
          })
        }
      >
        Plain data
      </button>

      <button
        className={buttonClass}
        onClick={(e) =>
          teachSetBlock({
            ...prefix,
            block: "data/ListData",
            attrs: {
              dataTarget: "",
              classes: ""
            },
          })
        }
      >
        List data
      </button>
    </div>
  );
};
