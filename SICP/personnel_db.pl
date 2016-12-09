% | ?- consult('personnel_db.pl').
% で本ファイルを読み込む。なお、
% | ?- listing.
% で内容を確認できる。

% GNU Prologでは、同じ述語を連続して (まとめて) 記述しておかないと
% 「discontiguous predicate address/2 - clause ignored」
% のようなエラーが出るので、それを回避するためのおまじない。
:- discontiguous(address/2, job/2, salary/2, supervisor/2, can_do_job/2).

% 以下、人事データベース。
address(['Bitdiddle', 'Ben'], ['Slumerville', ['Ridge', 'Road'], 10]).
job(['Bitdiddle', 'Ben'], [computer, wizard]).
salary(['Bitdiddle', 'Ben'], 60000).

address(['Hacker', 'Alyssa', 'P'], ['Cambridge', ['Mass', 'Ave'], 78]).
job(['Hacker', 'Alyssa', 'P'], [computer, programmer]).
salary(['Hacker', 'Alyssa', 'P'], 40000).
supervisor(['Hacker', 'Alyssa', 'P'], ['Bitdiddle', 'Ben']).

address(['Fect', 'Cy', 'D'], ['Cambridge', ['Ames', 'Street'], 3]).
job(['Fect', 'Cy', 'D'], [computer, programmer]).
salary(['Fect', 'Cy', 'D'], 35000).
supervisor(['Fect', 'Cy', 'D'], ['Bitdiddle', 'Ben']).

address(['Tweakit', 'Lem', 'E'], ['Boston', ['Bay', 'State', 'Road'], 22]).
job(['Tweakit', 'Lem', 'E'], [computer, technician]).
salary(['Tweakit', 'Lem', 'E'], 25000).
supervisor(['Tweakit', 'Lem', 'E'], ['Bitdiddle', 'Ben']).

address(['Reasoner', 'Louis'], ['Slumerville', ['Pine', 'Tree', 'Road'], 80]).
job(['Reasoner', 'Louis'], [computer, programmer, trainee]).
salary(['Reasoner', 'Louis'], 30000).
supervisor(['Reasoner', 'Louis'], ['Hacker', 'Alyssa', 'P']).

supervisor(['Bitdiddle', 'Ben'], ['Warbucks', 'Oliver']).

address(['Warbucks', 'Oliver'], ['Swellesley', ['Top', 'Heap', 'Road']]).
job(['Warbucks', 'Oliver'], [administration, big, wheel]).
salary(['Warbucks', 'Oliver'], 150000).

address(['Scrooge', 'Eben'], ['Weston', ['Shady', 'Lane'], 10]).
job(['Scrooge', 'Eben'], [accounting, chief, accountant]).
salary(['Scrooge', 'Eben'], 75000).
supervisor(['Scrooge', 'Eben'], ['Warbucks', 'Oliver']).

address(['Cratchet', 'Robert'], ['Allston', ['N', 'Harvard', 'Street'], 16]).
job(['Cratchet', 'Robert'], [accounting, scrivener]).
salary(['Cratchet', 'Robert'], 18000).
supervisor(['Cratchet', 'Robert'], ['Scrooge', 'Eben']).

address(['Aull', 'DeWitt'], ['Slumerville', ['Onion', 'Square'], 5]).
job(['Aull', 'DeWitt'], [administration, secretary]).
salary(['Aull', 'DeWitt'], 25000).
supervisor(['Aull', 'DeWitt'], ['Warbucks', 'Oliver']).

can_do_job([computer, wizard], [computer, programmer]).
can_do_job([computer, wizard], [computer, technician]).
can_do_job([computer, programmer], [computer, programmer, trainee]).
can_do_job([administration, secretary], [administration, big, wheel]).


% 規則
lives_near(Person_1, Person_2) :- 
    address(Person_1, [Town | Rest_1]),
    address(Person_2, [Town | Rest_2]),
    \+(same(Rest_1, Rest_2)).
same(X, X).

wheel(Person) :- 
    supervisor(Middle_manager, Person), 
    supervisor(X, Middle_manager).

outranked_by(Staff_person, Boss) :-
    supervisor(Staff_person, Boss);
    (supervisor(Staff_person, Middle_manager), 
     outranked_by(Middle_manager, Boss)).

%練習問題4.57.
can_replace(Person1, Person2) :-
    ( (job(Person1, Job1), job(Person2, Job1)) ;
      (job(Person1, Job1), job(Person2, Job2), can_do_job(Job1, Job2)) ),
    \+(same(Person1, Person2)).

%練習問題4.58.
is_big_shot(Who, Division1) :-
    job(Who, [Division1 |_]), supervisor(Who, Supervisor),
    job(Supervisor, [Division2 |_]), \+(same(Division1, Division2)).
is_big_shot(Who, Div) :-
    job(Who, [Div |_]), \+(supervisor(Who, Someone_else)).

%練習問題4.59.
meeting(accounting, ['Monday', '9am']).
meeting(administration, ['Monday', '10am']).
meeting(computer, ['Wednesday', '3pm']).
meeting(administration, ['Friday', '1pm']).
meeting(whole_company, ['Wednesday', '4pm']).
meeting_time(Person, Day_and_Time) :-
    meeting(whole_company, Day_and_Time) ;
    job(Person, [Division |_]), meeting(Division, Day_and_Time).

%練習問題4.60
lives_near_ver2(Person_1, Person_2) :- 
    address(Person_1, [Town | Rest_1]),
    address(Person_2, [Town | Rest_2]),
    Person_1 @< Person_2.
lives_near_ver3(Person_1, Person_2) :- 
    lives_near(Person_1, Person_2), Person_1 @< Person_2.
