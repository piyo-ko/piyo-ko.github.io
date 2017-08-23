% GNU Prologでは、同じ述語を連続して (まとめて) 記述しておかないと
% エラーが出るので、それを回避するためのおまじない。
:- discontiguous(son/2, wife/2).

% 以下、聖書の家系図データベース。
son('Adam', 'Cain').
son('Cain', 'Enoch').
son('Enoch', 'Irad').
son('Irad', 'Mehujael').
son('Mehujael', 'Methushael').
son('Methushael', 'Lamech').
wife('Lamech', 'Ada').
son('Ada', 'Jabal').
son('Ada', 'Jubal').

% 練習問題4.63
grandson(G, S) :- son(G, F), son(F, S).
son(M, S) :- wife(M, W), son(W, S).
