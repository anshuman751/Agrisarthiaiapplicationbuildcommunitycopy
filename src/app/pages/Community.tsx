import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { storage } from '../utils/storage';
import { Users, Heart, MessageCircle, Upload, Send } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';

export function Community() {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    image: null as string | null
  });
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    const communityPosts = storage.getCommunityPosts();
    setPosts(communityPosts);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewPost(prev => ({
          ...prev,
          image: event.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.content) return;

    const post = storage.saveCommunityPost({
      author: storage.getUserProfile().name,
      title: newPost.title,
      content: newPost.content,
      image: newPost.image
    });

    setNewPost({ title: '', content: '', image: null });
    loadPosts();
  };

  const handleLike = (postId: string) => {
    storage.likePost(postId);
    loadPosts();
  };

  const handleComment = (postId: string) => {
    const text = commentText[postId];
    if (!text) return;

    storage.addComment(postId, {
      author: storage.getUserProfile().name,
      text
    });

    setCommentText(prev => ({ ...prev, [postId]: '' }));
    loadPosts();
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Farmer Community</h1>
        <p className="text-gray-600 mt-2">
          Connect with farmers, share experiences, and learn together
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Create Post */}
        <Card className="border-2 border-teal-200 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-teal-600" />
              Create Post
            </CardTitle>
            <CardDescription>
              Share your farming experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="What's on your mind?"
                value={newPost.title}
                onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Share your thoughts, tips, or questions..."
                rows={5}
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
              />
            </div>

            <div>
              {newPost.image && (
                <div className="mb-3">
                  <img 
                    src={newPost.image} 
                    alt="Upload preview" 
                    className="w-full rounded-lg"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setNewPost(prev => ({ ...prev, image: null }))}
                    className="mt-2"
                  >
                    Remove Image
                  </Button>
                </div>
              )}
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Image
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <Button
              onClick={handleCreatePost}
              disabled={!newPost.title || !newPost.content}
              className="w-full bg-gradient-to-r from-teal-500 to-green-600 text-white"
            >
              <Send className="h-4 w-4 mr-2" />
              Post
            </Button>
          </CardContent>
        </Card>

        {/* Posts Feed */}
        <div className="lg:col-span-2 space-y-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Card key={post.id} className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-green-600 text-white">
                        {post.author.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{post.author}</h3>
                      <p className="text-sm text-gray-500">{formatTime(post.timestamp)}</p>
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mt-3">{post.title}</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">{post.content}</p>

                  {post.image && (
                    <img 
                      src={post.image} 
                      alt="Post" 
                      className="w-full rounded-lg"
                    />
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-4 pt-3 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      className="gap-2"
                    >
                      <Heart className={`h-4 w-4 ${post.likes > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                      {post.likes} {post.likes === 1 ? 'Like' : 'Likes'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      {post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}
                    </Button>
                  </div>

                  {/* Comments */}
                  {post.comments.length > 0 && (
                    <div className="space-y-3 pt-3 border-t">
                      {post.comments.map((comment: any) => (
                        <div key={comment.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-blue-600 text-white text-xs">
                              {comment.author.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm">{comment.author}</span>
                              <span className="text-xs text-gray-500">
                                {formatTime(comment.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Comment */}
                  <div className="flex gap-2 pt-3 border-t">
                    <Input
                      placeholder="Write a comment..."
                      value={commentText[post.id] || ''}
                      onChange={(e) => setCommentText(prev => ({ 
                        ...prev, 
                        [post.id]: e.target.value 
                      }))}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleComment(post.id);
                        }
                      }}
                    />
                    <Button
                      onClick={() => handleComment(post.id)}
                      disabled={!commentText[post.id]}
                      size="sm"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border-2 border-gray-200">
              <CardContent className="text-center py-12">
                <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 mb-4">No posts yet. Be the first to share!</p>
                <Badge className="bg-teal-100 text-teal-800">
                  Create your first post to start connecting
                </Badge>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Community Guidelines */}
      <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="text-green-800">🤝 Community Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4 text-green-900 text-sm">
          <div>
            <h4 className="font-semibold mb-1">Be Respectful</h4>
            <p>Treat all farmers with respect and courtesy</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Share Knowledge</h4>
            <p>Help others by sharing your farming experiences</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Stay Positive</h4>
            <p>Foster a supportive and encouraging community</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
