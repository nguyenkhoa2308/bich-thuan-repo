import { MessageSquare } from 'lucide-react'

const NoChatSelected = () => {
    return (
        <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center">
            <div className="max-w-md text-center space-y-6">
                {/* Icon Display */}
                <div className="d-flex justify-content-center gap-4 mb-4">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-bounce">
                            <MessageSquare className="w-8 h-8 text-primary " />
                        </div>
                    </div>
                </div>

                {/* Welcome Text */}
                <h2 className="text-2xl font-bold">Welcome to Chat!</h2>
                <p className="text-base-content/60">Chọn một cuộc trò chuyện từ thanh bên để bắt đầu trò chuyện</p>
            </div>
        </div>
    )
}

export default NoChatSelected
