<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ArticleController extends Controller
{
    public function index(){
        $articles = Article::orderByDesc('created_at')->paginate(5);
        return view('articles.index', compact('articles'));
    }

    public function create(){
        return view('articles.create');
    }

    public function store(Request $request){
        $article = new Article();
        $article->title = $request->title;
        $article->content = $request->content;
        $article->user_id = Auth::user()->id;
        $article->save();
        return redirect(route('article.index'));
    }

    public function show(Article $article){
        return view('articles.show', compact('article'));
    }
}