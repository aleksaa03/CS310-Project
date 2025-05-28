import { useUser } from "../hooks/use-user";
import { formatDateTime } from "../utils/date";
import { TrashIcon } from "@heroicons/react/24/outline";

type Props = {
  commentId: number;
  comment: string;
  createdAt: Date;
  username: string;
  userId: number;
  onCommentDelete: (commentId: number) => void;
};

const CommentCard = ({ commentId, comment, createdAt, username, userId, onCommentDelete }: Props) => {
  const user = useUser();

  return (
    <div className="shadow-md rounded-xl p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <p className="font-semibold">{username}</p>
        <div className="flex items-center space-x-3">
          <span className="text-sm">{formatDateTime(createdAt)}</span>
          {user?.currentUser?.id === userId && (
            <button
              onClick={() => onCommentDelete(commentId)}
              className="p-1 text-red-600 rounded hover:bg-red-600 hover:text-white transition cursor-pointer"
            >
              <TrashIcon className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
      <p>{comment}</p>
    </div>
  );
};

export default CommentCard;
